import type { LengthUnit } from './units';
import { toMm } from './units';

export function num(form: HTMLFormElement, name: string): number {
  const el = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;
  if (!el) throw new Error(`Missing field: ${name}`);
  const value = Number(el.value);
  if (!Number.isFinite(value)) throw new Error(`Enter a valid number for ${name}.`);
  return value;
}

export function str(form: HTMLFormElement, name: string): string {
  const el = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;
  if (!el) throw new Error(`Missing field: ${name}`);
  return el.value;
}

export function lengthMm(form: HTMLFormElement, valueName: string, unitName: string): number {
  return toMm(num(form, valueName), str(form, unitName) as LengthUnit);
}

export function setText(id: string, value: string) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

export function showResult(id = 'result') {
  const el = document.getElementById(id);
  if (el) el.hidden = false;
}

export function hideResult(id = 'result') {
  const el = document.getElementById(id);
  if (el) el.hidden = true;
}

export function setError(message = '') {
  const el = document.getElementById('error');
  if (el) el.textContent = message;
}

export function rememberForm(form: HTMLFormElement, key: string) {
  const storageKey = `labelmetric:${key}`;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const values = JSON.parse(saved) as Record<string, string>;
      for (const [name, value] of Object.entries(values)) {
        const field = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;
        if (field && field.type !== 'submit' && field.type !== 'button') field.value = value;
      }
    }
    const persist = () => {
      const data: Record<string, string> = {};
      Array.from(form.elements).forEach((element) => {
        const field = element as HTMLInputElement | HTMLSelectElement;
        if (field.name && field.type !== 'submit' && field.type !== 'button') data[field.name] = field.value;
      });
      localStorage.setItem(storageKey, JSON.stringify(data));
    };
    form.addEventListener('input', persist);
    form.addEventListener('change', persist);
  } catch {
    // Storage is optional; calculators still work if unavailable.
  }
}

export function copyText(text: string, buttonId = 'copy-result') {
  const button = document.getElementById(buttonId) as HTMLButtonElement | null;
  if (!button) return;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text);
      const original = button.textContent;
      button.textContent = 'Copied';
      setTimeout(() => (button.textContent = original), 1200);
    } catch {
      // Ignore clipboard failures; the result remains visible.
    }
  });
}
