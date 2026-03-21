import { FaChevronDown } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Headphones } from 'lucide-react';

export const ChannelHeader = ({ name, isHuddleActive, startHuddle, isHuddleLiveInChannel }) => {
    return (
        <div
            className="bg-white border-b h-[50px] flex items-center justify-between px-4 overflow-hidden w-full"
        >
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        className="text-lg font-semibold px-2 w-auto overflow-hidden"
                    >
                        <span># {name} </span>
                        <FaChevronDown className='size-3 ml-2' />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            # {name}
                        </DialogTitle>

                    </DialogHeader>
                    <div
                        className='px-4 pb-4 flex flex-col gap-y-2'
                    >   
                        <div
                            className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-100'
                        >
                            <div className='flex items-center justify-between'>
                                <p className='text-sm font-semibold'>
                                    Channel name
                                </p>
                                <p className='text-sm font-semibold'>
                                    Edit 
                                </p>
                            </div>
                            <p className='text-sm'>
                                {name}
                            </p>

                        </div>

                        {/* HW implement edit dialog for editting name of a channel */}

                    </div>
                </DialogContent>
            </Dialog>

            {/* Huddle Interactive Toggle */}
            <div className="flex items-center gap-2">
                {!isHuddleActive && !isHuddleLiveInChannel && (
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={startHuddle}
                        className="h-8 text-xs font-semibold rounded-full border-sky-400/60 text-sky-600 hover:bg-sky-50 hover:text-sky-700 transition"
                    >
                        <Headphones className="size-3.5 mr-2" />
                        Start Huddle
                    </Button>
                )}
                {!isHuddleActive && isHuddleLiveInChannel && (
                    <Button 
                        size="sm" 
                        onClick={startHuddle}
                        className="h-8 text-xs font-semibold rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2 px-3"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        Join Huddle
                    </Button>
                )}
                {isHuddleActive && (
                    <span className="flex items-center gap-2 text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full ring-1 ring-green-400">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        In Huddle...
                    </span>
                )}
            </div>

        </div>
    );
};