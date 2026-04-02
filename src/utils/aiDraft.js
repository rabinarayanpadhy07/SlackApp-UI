export const buildEditorDraftFromText = (text = '') => {
    const normalized = text.replace(/\r\n/g, '\n').trim();

    return JSON.stringify({
        ops: [
            {
                insert: normalized ? `${normalized}\n` : '\n'
            }
        ]
    });
};
