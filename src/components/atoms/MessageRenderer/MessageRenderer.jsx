import Quill from 'quill';
import 'quill-mention/autoregister';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const MessageRenderer = ({ value }) => {
    console.log('Value: ', value);
    const rendererRef = useRef(null);
    const navigate = useNavigate();
    const { workspaceId } = useParams();
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        console.log('Renderer Ref: ', rendererRef.current);
        if(!rendererRef.current) return;

        console.log('Value: ', value);

        const quill = new Quill(document.createElement('div'), {
            theme: 'snow',
            modules: {
                toolbar: false,
                mention: false
            }
        });
        // Disable editting 
        quill.disable();
        const content = JSON.parse(value);
        quill.setContents(content);
        console.log('Content: ', quill.root.innerHTML);
        const isContentEmpty = quill.getText().trim().length === 0;
        setIsEmpty(isContentEmpty);
        rendererRef.current.innerHTML = quill.root.innerHTML;

        const handleMentionClick = (e) => {
            const mentionSpan = e.target.closest('.mention');
            if (mentionSpan) {
                const char = mentionSpan.getAttribute('data-denotation-char');
                const id = mentionSpan.getAttribute('data-id');
                if (char === '#' && workspaceId) {
                    navigate(`/workspaces/${workspaceId}/channels/${id}`);
                }
            }
        };

        const currentRenderer = rendererRef.current;
        currentRenderer.addEventListener('click', handleMentionClick);

        return () => {
            currentRenderer.removeEventListener('click', handleMentionClick);
        };
    }, [value, navigate, workspaceId]);

    if(isEmpty) return null;

    return (
        <div ref={rendererRef} className="ql-editor ql-renderer" />
    );
};