function formatDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function hashString(value: string): number {
    let hash = 0;

    for (let i = 0; i < value.length; i++) {
        hash = (hash * 31 + value.charCodeAt(i)) | 0;
    }

    return Math.abs(hash);
}

export function pickDailyMessage<T>(messages: T[], date: Date = new Date()): T | null {
    if (!messages.length) {
        return null;
    }

    const dayKey = formatDateKey(date);
    const index = hashString(dayKey) % messages.length;

    return messages[index];
}
