import 'quill/dist/quill.snow.css'; // ES6
import 'quill-mention/autoregister';
import 'quill-mention/dist/quill.mention.css';

import { ImageIcon, XIcon } from 'lucide-react';
import Quill from 'quill';
import { useEffect, useRef, useState } from 'react';
import { MdSend } from 'react-icons/md';
import { PiTextAa } from 'react-icons/pi';

import { Button } from '@/components/ui/button';

import { Hint } from '../Hint/Hint';
export const Editor = ({
    variant = 'create',
    onSubmit,
    onTextChange,
    workspaceMembers = [],
    workspaceChannels = [],
    onCancel,
    placeholder,
    defaultValue,
    seedValue
}) => {

    const [isToolbarVisible, setIsToolbarVisible] = useState(false);

    const [image, setImage] = useState(null);

    const containerRef = useRef(); // reqd to initialize the editor
    const defaultValueRef = useRef([]);
    const quillRef = useRef();
    const imageInputRef = useRef(null);
    const onTextChangeRef = useRef(onTextChange);
    const submitRef = useRef(null);
    const lastAppliedSeedRef = useRef(null);
    const workspaceMembersRef = useRef(workspaceMembers);
    const workspaceChannelsRef = useRef(workspaceChannels);

    useEffect(() => {
        try {
            defaultValueRef.current = defaultValue ? JSON.parse(defaultValue) : [];
        } catch {
            defaultValueRef.current = [];
        }
    }, [defaultValue]);

    useEffect(() => {
        onTextChangeRef.current = onTextChange;
    }, [onTextChange]);

    useEffect(() => {
        workspaceMembersRef.current = workspaceMembers;
        workspaceChannelsRef.current = workspaceChannels;
    }, [workspaceChannels, workspaceMembers]);

    function toggleToolbar() {
        setIsToolbarVisible(!isToolbarVisible);
        const toolbar = containerRef.current.querySelector('.ql-toolbar');
        if(toolbar) {
            toolbar.classList.toggle('hidden');
        }
    }

    submitRef.current = () => {
        const contents = quillRef.current?.getContents();
        const text = quillRef.current?.getText().replace(/\n$/, '');
        
        if (!text && !image && variant === 'create') return;

        const messageContent = JSON.stringify(contents);
        
        const mentions = [];
        contents?.ops?.forEach(op => {
            if (op.insert && op.insert.mention) {
                if (op.insert.mention.denotationChar === '@') {
                    mentions.push(op.insert.mention.id);
                }
            }
        });

        onSubmit({ body: messageContent, image, mentions });
        quillRef.current?.setText('');
        setImage(null);
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    };

    useEffect(() => {

        if(!containerRef.current) return; // if containerRef is not initialized, return

        const container = containerRef.current; // get the container element

        const editorContainer = container.appendChild(container.ownerDocument.createElement('div')); // create a new div element and append it to the container

        const options = {
            theme: 'snow',
            placeholder,
            modules: {
                mention: {
                    allowedChars: /^[A-Za-z0-9_\s]*$/,
                    mentionDenotationChars: ["@", "#"],
                    mentionContainer: document.body,
                    source: function (searchTerm, renderList, mentionChar) {
                        let values;

                        if (mentionChar === "@") {
                            values = workspaceMembersRef.current
                                .map(m => ({ id: m.memberId?._id, value: m.memberId?.username }))
                                .filter(m => m.id);
                        } else {
                            values = workspaceChannelsRef.current
                                .map(c => ({ id: c._id, value: c.name }));
                        }

                        if (searchTerm.length === 0) {
                            renderList(values, searchTerm);
                        } else {
                            const matches = [];
                            for (let i = 0; i < values.length; i++)
                                if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())) matches.push(values[i]);
                            renderList(matches, searchTerm);
                        }
                    },
                },
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['link'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['blockquote', 'code-block'],
                    ['clean']
                ],
                keyboard: {
                    bindings: {
                        enter: {
                            key: 'Enter',
                            shiftKey: false,
                            handler: () => {
                                const mentionModule = quillRef.current?.getModule('mention');
                                if (mentionModule && mentionModule.isOpen) {
                                    return true;
                                }

                                submitRef.current?.();
                                return false;
                            }
                        },
                        shift_enter: {
                            key: 'Enter',
                            shiftKey: true,
                            handler: (range) => {
                                quill.insertText(range.index, '\n');
                                quill.setSelection(range.index + 1);
                                return false;
                            }
                        }
                    }
                }
            }
        };

        const quill = new Quill(editorContainer, options);

        quillRef.current = quill;
        quillRef.current.focus();

        quill.setContents(defaultValueRef.current);

        quill.on('text-change', () => {
            if (onTextChangeRef.current) {
                onTextChangeRef.current();
            }
        });

        // Hide toolbar on initial load
        const toolbar = container.querySelector('.ql-toolbar');
        if (toolbar) {
            toolbar.classList.add('hidden');
        }

    }, [placeholder]);

    useEffect(() => {
        if (!quillRef.current || !seedValue || seedValue === lastAppliedSeedRef.current) return;

        try {
            const parsedSeed = JSON.parse(seedValue);
            quillRef.current.setContents(parsedSeed);
            const length = quillRef.current.getLength();
            quillRef.current.setSelection(Math.max(length - 1, 0), 0);
            quillRef.current.focus();
            lastAppliedSeedRef.current = seedValue;
        } catch {
            // Ignore malformed externally seeded drafts.
        }
    }, [seedValue]);


    return (
        <div
            className='flex flex-col'
        >

            <div
                className='flex flex-col border border-slate-300 rounded-md focus-within:shadow-sm focus-within:border-slate-400 bg-white relative'
            >
                <div className='h-full ql-custom' ref={containerRef} />
                {
                    image && (
                        <div
                            className='p-2'
                        >
                            <div className='relative size-[60px] flex items-center justify-center group/image'>
                                <button
                                    className='hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[5] border-2 border-white items-center justify-center'
                                    onClick={() => {
                                        setImage(null);
                                        imageInputRef.current.value = '';
                                    }}
                                >
                                    <XIcon className='size-4' />
                                </button>
                                <img 
                                    src={URL.createObjectURL(image)}
                                    className='rounded-xl overflow-hidden border object-cover'
                                />
                            </div>
                        </div>
                    )
                }

                <div className='flex px-2 pb-2 z-[5]'>
                    <Hint label={!isToolbarVisible ? 'Show toolbar' : 'Hide toolbar'} side='bottom' align='center'>
                        <Button
                            size="iconSm"
                            variant="ghost"
                            disabled={false}
                            onClick={toggleToolbar}
                        >
                            <PiTextAa className='size-4' />
                        </Button>
                    </Hint>

                    <Hint label="Image">
                        <Button
                            size="iconSm"
                            variant="ghost"
                            disabled={false}
                            onClick={() => { imageInputRef.current.click(); }}
                        >
                            <ImageIcon className='size-4' />
                        </Button>
                    </Hint>

                    <input 
                        type="file"
                        className='hidden'
                        ref={imageInputRef}
                        onChange={(e) => setImage(e.target.files[0])}
                    />

                    <div className="ml-auto flex items-center gap-2">
                        {variant === 'update' && (
                            <Button variant="outline" size="sm" onClick={onCancel}>
                                Cancel
                            </Button>
                        )}
                        <Hint label="Send Message">
                            <Button
                                size={variant === 'update' ? 'sm' : 'iconSm'}
                                className="bg-[#007a6a] hover:bg-[#007a6a]/80 text-white"
                                onClick={() => {
                                    submitRef.current?.();
                                }}
                                disabled={false}
                            >
                                {variant === 'update' ? 'Save' : <MdSend className='size-4' />}
                            </Button>
                        </Hint>
                    </div>
                </div>
            </div>

            <p
                className='p-2 text-[10px] text-mutes-foreground flex justify-end'
            >
                <strong>Shift + return</strong> &nbsp; to add a new line
            </p>
        </div>
    );
};
