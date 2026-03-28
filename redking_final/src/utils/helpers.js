export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function isEditableElement(target) {
  if (!target || typeof target !== "object") return false;
  const tagName = target.tagName;
  return target.isContentEditable || tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";
}
