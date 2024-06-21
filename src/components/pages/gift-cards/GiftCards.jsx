import { CheckIcon, PencilIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react'
import recoveryLabLogo from '../../../assets/images/logoBlack.svg';
import { Switch } from '@headlessui/react'
import HeadlessUIModalComponent from '../../shared-components/modal/HeadlessUIModal';


const GiftCards = () => {

    const [giftCards, setGiftCards] = useState([]);

    // Add Gift Card States
    const [showAddGiftCard, setShowAddGiftCard] = useState(false);
    const [addGiftCardName, setAddGiftCardName] = useState('');
    const [addGiftCardPrice, setAddGiftCardPrice] = useState('');
    const [addGiftCardDescription, setAddGiftCardDescription] = useState('');
    const [addGiftCardBonusValue, setAddGiftCardBonusValue] = useState('');

    // Edit Gift Card States
    const [showEditGiftCard, setShowEditGiftCard] = useState(false);
    const [editGiftCardId, setEditGiftCardId] = useState(null);
    const [editGiftCardName, setEditGiftCardName] = useState('');
    const [editGiftCardPrice, setEditGiftCardPrice] = useState('');
    const [editGiftCardDescription, setEditGiftCardDescription] = useState('');
    const [editGiftCardBonusValue, setEditGiftCardBonusValue] = useState('');

    // Delete Gift Card States
    const [showDeleteGiftCard, setShowDeleteGiftCard] = useState(false);
    const [deleteGiftCardId, setDeleteGiftCardId] = useState(null);

    useEffect(() => {
        setGiftCards([
            {
                id: 1,
                giftCardName: 'Gift Card 1',
                giftCardPrice: 75,
                giftCardDescription: 'Gift Card 1 Description',
                giftCardBonusValue: 100,
                status: true
            },
            {
                id: 2,
                giftCardName: 'Gift Card 2',
                giftCardPrice: 50,
                giftCardDescription: 'Gift Card 2 Description',
                giftCardBonusValue: 75,
                status: true
            },
            {
                id: 3,
                giftCardName: 'Gift Card 3',
                giftCardPrice: 100,
                giftCardDescription: 'Gift Card 3 Description',
                giftCardBonusValue: 150,
                status: false
            },
            {
                id: 4,
                giftCardName: 'Gift Card 4',
                giftCardPrice: 200,
                giftCardDescription: 'Gift Card 4 Description',
                giftCardBonusValue: 300,
                status: true
            },
        ]);
    }, []);

    const handleGiftCardStatusChange = (id, newStatus) => {
        setGiftCards(giftCards.map(giftCard => {
            if (giftCard.id === id) {
                giftCard.status = newStatus;
            }
            return giftCard;
        }));
    }

    const GiftCardComponent = ({ giftCard }) => {
        return (
            <div className='relative flex flex-col justify-between h-44 border bg-amber-100 text-amber-950 text-left rounded-xl py-2 px-4'>
                <img
                    src={recoveryLabLogo}
                    alt="Recovery Lab Logo"
                    draggable={false}
                    className='w-28 h-28 select-none absolute top-1/2 right-4 -translate-y-1/2 opacity-20'
                />
                <div className='flex flex-col justify-evenly h-4/5'>
                    <div className='flex justify-between items-center'>
                        <div>
                            <h1 className='text-xl font-semibold'>{giftCard.giftCardName}</h1>
                            <p className='text-sm'>{giftCard.giftCardDescription}</p>
                        </div>
                        <h1 className='text-4xl font-semibold'>${giftCard.giftCardBonusValue}</h1>
                    </div>
                    <div className=''>
                        <p className='text-lg'>Price: ${giftCard.giftCardPrice}</p>
                    </div>
                </div>
                <div className='h-1/5'>
                    <div className='flex h-full justify-between items-center'>
                        <Switch
                            checked={giftCard.status}
                            onChange={(newStatus) => { handleGiftCardStatusChange(giftCard.id, newStatus) }}
                            className={`border ${giftCard.status ? 'bg-green-300 border-green-500' : 'bg-red-300 border-red-500'} relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                        >
                            <span
                                aria-hidden="true"
                                className={`${giftCard.status ? 'translate-x-6 bg-green-700/90' : 'translate-x-0 bg-red-700/90'} pointer-events-none text-white inline-block h-5 w-5 transform mt-[1px] ml-[1px] rounded-full shadow-lg ring-0 transition-all duration-200 ease-in-out`}
                            >
                                {giftCard.status
                                    ?
                                    <CheckIcon className='w-4 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2' />
                                    :
                                    <XMarkIcon className='w-4 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2' />
                                }
                            </span>
                        </Switch>
                        <div className='flex items-center gap-1'>
                            <button
                                title='Edit Gift Card'
                                onClick={() => {
                                    setShowEditGiftCard(true);
                                    setEditGiftCardId(giftCard.id);
                                    setEditGiftCardName(giftCard.giftCardName);
                                    setEditGiftCardPrice(giftCard.giftCardPrice);
                                    setEditGiftCardDescription(giftCard.giftCardDescription);
                                    setEditGiftCardBonusValue(giftCard.giftCardBonusValue);
                                }}
                                className='bg-indigo-300 flex items-center gap-1 p-2 rounded-full hover:bg-indigo-400 text-indigo-900 font-semibold'
                            >
                                <PencilIcon className='w-5 h-5' />
                            </button>
                            <button
                                title='Delete Gift Card'
                                onClick={() => {
                                    setShowDeleteGiftCard(true);
                                    setDeleteGiftCardId(giftCard.id);
                                }}
                                className='bg-red-300 flex items-center gap-1 p-2 rounded-full hover:bg-red-400 text-red-900 font-semibold'
                            >
                                <TrashIcon className='w-5 h-5' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const addGiftCardModalBodyJSX = (
        <div className='grid grid-cols-2 gap-3 my-5'>
            <div className='flex flex-col col-span-2'>
                <label htmlFor="addGiftCardName" className='text-sm font-semibold'>Gift Card Name</label>
                <input
                    type="text"
                    id="addGiftCardName"
                    className='p-2 border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-lg'
                    value={addGiftCardName}
                    onChange={(e) => setAddGiftCardName(e.target.value)}
                />
            </div>
            <div className='flex flex-col col-span-2'>
                <label htmlFor="addGiftCardDescription" className='text-sm font-semibold'>Gift Card Description</label>
                <textarea
                    id="addGiftCardDescription"
                    className='p-2 border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-lg'
                    value={addGiftCardDescription}
                    onChange={(e) => setAddGiftCardDescription(e.target.value)}
                />
            </div>
            <div className='flex flex-col'>
                <label htmlFor="addGiftCardPrice" className='text-sm font-semibold'>Gift Card Price</label>
                <input
                    type="number"
                    id="addGiftCardPrice"
                    className='p-2 border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-lg'
                    value={addGiftCardPrice}
                    onChange={(e) => setAddGiftCardPrice(e.target.value)}
                />
            </div>
            <div className='flex flex-col'>
                <label htmlFor="addGiftCardBonusValue" className='text-sm font-semibold'>Gift Card Bonus Value</label>
                <input
                    type="number"
                    id="addGiftCardBonusValue"
                    className='p-2 border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-lg'
                    value={addGiftCardBonusValue}
                    onChange={(e) => setAddGiftCardBonusValue(e.target.value)}
                />
            </div>
        </div>
    )

    const handleGiftCardAdd = () => {
        let newGiftCard = {
            id: (giftCards.reduce((max, obj) => Math.max(max, obj['id']), null) + 1),
            giftCardName: addGiftCardName,
            giftCardPrice: addGiftCardPrice,
            giftCardDescription: addGiftCardDescription,
            giftCardBonusValue: addGiftCardBonusValue,
            status: true
        }
        setGiftCards([...giftCards, newGiftCard]);
        setShowAddGiftCard(false);
        setAddGiftCardName('');
        setAddGiftCardPrice('');
        setAddGiftCardDescription('');
        setAddGiftCardBonusValue('');
    }

    const editGiftCardModalBodyJSX = (
        <div className='grid grid-cols-2 gap-3 my-5'>
            <div className='flex flex-col col-span-2'>
                <label htmlFor="editGiftCardName" className='text-sm font-semibold'>Gift Card Name</label>
                <input
                    type="text"
                    id="editGiftCardName"
                    className='p-2 border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-lg'
                    value={editGiftCardName}
                    onChange={(e) => setEditGiftCardName(e.target.value)}
                />
            </div>
            <div className='flex flex-col col-span-2'>
                <label htmlFor="editGiftCardDescription" className='text-sm font-semibold'>Gift Card Description</label>
                <textarea
                    id="editGiftCardDescription"
                    className='p-2 border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-lg'
                    value={editGiftCardDescription}
                    onChange={(e) => setEditGiftCardDescription(e.target.value)}
                />
            </div>
            <div className='flex flex-col'>
                <label htmlFor="editGiftCardPrice" className='text-sm font-semibold'>Gift Card Price</label>
                <input
                    type="number"
                    id="editGiftCardPrice"
                    className='p-2 border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-lg'
                    value={editGiftCardPrice}
                    onChange={(e) => setEditGiftCardPrice(e.target.value)}
                />
            </div>
            <div className='flex flex-col'>
                <label htmlFor="editGiftCardBonusValue" className='text-sm font-semibold'>Gift Card Bonus Value</label>
                <input
                    type="number"
                    id="editGiftCardBonusValue"
                    className='p-2 border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-lg'
                    value={editGiftCardBonusValue}
                    onChange={(e) => setEditGiftCardBonusValue(e.target.value)}
                />
            </div>
        </div>
    )

    const handleGiftCardEditSave = () => {
        setGiftCards(giftCards.map(giftCard => {
            if (giftCard.id === editGiftCardId) {
                giftCard.giftCardName = editGiftCardName;
                giftCard.giftCardPrice = editGiftCardPrice;
                giftCard.giftCardDescription = editGiftCardDescription;
                giftCard.giftCardBonusValue = editGiftCardBonusValue;
            }
            return giftCard;
        }));
        setShowEditGiftCard(false);
        setEditGiftCardId(null);
        setEditGiftCardName('');
        setEditGiftCardPrice('');
        setEditGiftCardDescription('');
        setEditGiftCardBonusValue('');
    }

    return (
        <div className='p-5'>
            {/* Add Gift Card */}
            <HeadlessUIModalComponent
                displayState={showAddGiftCard}
                setDisplayState={setShowAddGiftCard}
                headingChildren={"Add Gift Card"}
                bodyChildren={addGiftCardModalBodyJSX}
                footerChildren={
                    <div className='flex justify-end gap-3'>
                        <button
                            onClick={() => setShowAddGiftCard(false)}
                            className='bg-indigo-300 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-indigo-400 text-indigo-900 font-semibold'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleGiftCardAdd()}
                            className='bg-indigo-600 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-indigo-700 text-indigo-100 font-semibold'
                        >
                            Add
                        </button>
                    </div>
                }
            />

            {/* Edit Gift card */}
            <HeadlessUIModalComponent
                displayState={showEditGiftCard}
                setDisplayState={setShowEditGiftCard}
                headingChildren={"Edit Gift Card"}
                bodyChildren={editGiftCardModalBodyJSX}
                footerChildren={
                    <div className='flex justify-end gap-3'>
                        <button
                            onClick={() => {
                                setShowEditGiftCard(false)
                                setEditGiftCardId(null)
                                setEditGiftCardName('')
                                setEditGiftCardPrice('')
                                setEditGiftCardDescription('')
                                setEditGiftCardBonusValue('')
                            }}
                            className='bg-indigo-300 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-indigo-400 text-indigo-900 font-semibold'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleGiftCardEditSave()}
                            className='bg-indigo-600 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-indigo-700 text-indigo-100 font-semibold'
                        >
                            Save
                        </button>
                    </div>
                }
            />

            {/* Delete Gift Card */}
            <HeadlessUIModalComponent
                displayState={showDeleteGiftCard}
                setDisplayState={setShowDeleteGiftCard}
                headingChildren={"Delete Gift Card"}
                bodyChildren={<p>Are you sure you want to delete <b>{giftCards.find(gc => gc.id === deleteGiftCardId)?.giftCardName}</b>?</p>}
                footerChildren={
                    <div className='flex justify-end gap-3'>
                        <button
                            onClick={() => setShowDeleteGiftCard(false)}
                            className='bg-red-300 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-red-400 text-red-900 font-semibold'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                setGiftCards(giftCards.filter(giftCard => giftCard.id !== deleteGiftCardId));
                                setShowDeleteGiftCard(false);
                            }}
                            className='bg-red-600 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-red-700 text-red-100 font-semibold'
                        >
                            Delete
                        </button>
                    </div>
                }
            />

            <div className='flex mx-10 items-center justify-between' >
                <h1 className='text-2xl'>Gift Cards</h1>
                <button
                    onClick={() => setShowAddGiftCard(true)}
                    title='Add Center'
                    className='bg-indigo-300 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-indigo-400 text-indigo-900 font-semibold'
                >
                    <PlusIcon className="w-5 h-5" /> Add Gift Card
                </button>
            </div>
            <div className='mx-10 my-5 grid grid-cols-3 gap-3'>
                {giftCards.map(giftCard => (
                    <GiftCardComponent key={giftCard.id} giftCard={giftCard} />
                ))}
            </div>
        </div>
    )
}

export default GiftCards;