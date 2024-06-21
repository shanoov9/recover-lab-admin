import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react'

const HeadlessUIModalComponent = ({
    displayState,
    setDisplayState,
    headingChildren,
    bodyChildren,
    footerChildren,
    maxWidthClass = 'max-w-md'
}) => {
    return (
        <Transition appear show={displayState} as={Fragment}>
            <Dialog as='div' className='fixed inset-0 z-10 overflow-y-auto' onClose={() => { setDisplayState(false) }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className={`w-full ${maxWidthClass} transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}>
                                <Dialog.Title
                                    as="h3"
                                    className="text-2xl font-medium flex items-center gap-3 leading-6 text-gray-950"
                                >
                                    {headingChildren}
                                </Dialog.Title>
                                <div className="mt-2">
                                    {bodyChildren}
                                </div>

                                <div className="mt-2 flex justify-end gap-2">
                                    {footerChildren}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default HeadlessUIModalComponent;