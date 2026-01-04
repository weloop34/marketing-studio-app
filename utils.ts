
import { Task, MarketingData, ViewMode, CarouselSlide } from './types';

// UTILS UNICODE FOR LINKEDIN (SANS-SERIF BOLD & ITALIC)
export const UNICODE_BOLD_MAP: any = {
  'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
  'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
  '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
};

export const UNICODE_ITALIC_MAP: any = {
  'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻',
  'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝗥', 'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝗩', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡'
};

export const toUnicode = (text: string, map: any) => text.split('').map(c => map[c] || c).join('');

export const markdownToHtml = (text: string) => {
  if (!text) return "";
  let html = text
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>');
  html = html
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.*?)\*/g, '<i>$1</i>');
  return html.replace(/\n/g, '<br>');
};

export const formatToLinkedInWYSIWYG = (html: string) => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const walk = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || "";
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tagName = el.tagName.toUpperCase();
      if (tagName === 'BR') return "\n";
      let content = "";
      for (const child of Array.from(el.childNodes)) content += walk(child);
      if (tagName === 'H1' || tagName === 'H2' || tagName === 'H3') return toUnicode(content.toUpperCase(), UNICODE_BOLD_MAP) + "\n\n";
      if (tagName === 'B' || tagName === 'STRONG' || el.style.fontWeight === 'bold') return toUnicode(content, UNICODE_BOLD_MAP);
      if (tagName === 'I' || tagName === 'EM' || el.style.fontStyle === 'italic') return toUnicode(content, UNICODE_ITALIC_MAP);
      if (tagName === 'LI') return "• " + content + "\n";
      if (tagName === 'P' || tagName === 'DIV') return content.trim() ? content + "\n" : "";
      return content;
    }
    return "";
  };
  const result = walk(temp);
  return result.split('\n').map(line => line.trimEnd()).join('\n').trim();
};

export const parseDate = (dateInput: string | Date): Date | null => {
  if (!dateInput) return null;
  if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
    return dateInput;
  }
  if (typeof dateInput === 'string') {
    // Try ISO format first (more common from APIs)
    const isoDate = new Date(dateInput);
    if (!isNaN(isoDate.getTime())) {
      return isoDate;
    }
    // Then try French format JJ/MM/AAAA
    const parts = dateInput.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const d = new Date(year, month, day);
        if(!isNaN(d.getTime())) return d;
      }
    }
  }
  return null;
};
