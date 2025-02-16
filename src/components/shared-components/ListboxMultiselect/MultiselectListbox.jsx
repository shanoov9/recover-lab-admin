import React, { useState } from "react";
import { Listbox, Transition } from "@headlessui/react";


const MultiselectListbox = ({
    selectedItems,
    setSelectedItems,
    label,
    type,
    nameVariable,
    items = [],
}) => {
    const [isOpen, setIsOpen] = useState(false);

    function isSelected(value) {
        if (typeof value === "object") {
            return selectedItems.find((el) => el.id === value.id) ? true : false;
        }
        return selectedItems.find((el) => el.id === value) ? true : false;
    }

    function handleSelect(value) {
        if (!isSelected(value)) {
            const selectedItemsUpdated = [
                ...selectedItems,
                items.find((el) => el.id === value)
            ];
            setSelectedItems(selectedItemsUpdated);
        } else {
            handleDeselect(value);
        }
        setIsOpen(true);
    }

    function handleDeselect(value) {
        const selectedItemsUpdated = selectedItems.filter((el) => el.id !== value);
        setSelectedItems(selectedItemsUpdated);
        setIsOpen(true);
    }

    return (
        <div className="flex items-center justify-center">
            <div className="w-full max-w-xs mx-auto">
                <Listbox
                    as="div"
                    className="space-y-1 w-full"
                    value={selectedItems}
                    onChange={(value) => handleSelect(value)}
                    open={isOpen}
                >
                    {() => (
                        <>
                            <Listbox.Label className="block text-sm leading-5 font-medium text-gray-700">
                                {label}
                            </Listbox.Label>
                            <div className="relative">
                                <span className="inline-block w-full rounded-md shadow-sm">
                                    <Listbox.Button
                                        className="cursor-default relative w-full rounded-md border-2 border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-indigo-600 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                                        onClick={() => setIsOpen(!isOpen)}
                                        open={isOpen}
                                    >
                                        <span className="block truncate">
                                            {selectedItems.length < 1
                                                ? `Select ${type}`
                                                : `Selected ${type} (${selectedItems.length})`}
                                        </span>
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                    </Listbox.Button>
                                </span>

                                <Transition
                                    unmount={false}
                                    show={isOpen}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                    className="absolute mt-1 w-full rounded-md bg-white shadow-lg"
                                >
                                    <Listbox.Options
                                        static
                                        className="max-h-64 border border-indigo-300 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
                                    >
                                        {items.map((item) => {
                                            const selected = isSelected(item);
                                            return (
                                                <Listbox.Option key={item.id} value={item.id}>
                                                    {({ active }) => (
                                                        <div
                                                            className={`${active
                                                                ? "text-indigo-900 bg-indigo-300"
                                                                : "text-gray-900"
                                                                } cursor-default select-none relative py-2 pl-8 pr-4`}
                                                        >
                                                            <span
                                                                className={`${selected ? "font-semibold" : "font-normal"
                                                                    } block truncate`}
                                                            >
                                                                {item[nameVariable]}
                                                            </span>
                                                            {selected && (
                                                                <span
                                                                    className={`${active ? "text-indigo-900" : "text-indigo-600"
                                                                        } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                                                                >
                                                                    <svg
                                                                        className="h-5 w-5"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </Listbox.Option>
                                            );
                                        })}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </>
                    )}
                </Listbox>
            </div>
        </div>
    );
}
export default MultiselectListbox;