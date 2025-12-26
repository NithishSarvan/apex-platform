import React, { useState, useRef } from 'react';
import { AiFillStar } from 'react-icons/ai';
import {
    FiUpload,
    FiPlus,
    FiTrash2,
    FiDownload,
    FiFileText
} from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

const DataTraining = ({ data, onUpdate }) => {

    /* ================= STATE ================= */
    const [activeTab, setActiveTab] = useState('Q&A Training');
    const { state } = useLocation();
    const { modelName } = state || {};

    const scrollContainerRef = useRef(null);
    const sectionRefs = useRef({});

    /* ================= SINGLE SOURCE OF TRUTH ================= */
    const tabs = ['Q&A Training', 'File Upload'];

    /* ================= SCROLL SPY ================= */
    const handleScroll = () => {
        if (!scrollContainerRef.current) return;

        const containerTop =
            scrollContainerRef.current.getBoundingClientRect().top;

        let currentTab = activeTab;

        tabs.forEach(tab => {
            const section = sectionRefs.current[tab];
            if (!section) return;

            const offset =
                section.getBoundingClientRect().top - containerTop;

            if (offset <= 80) currentTab = tab;
        });

        if (currentTab !== activeTab) {
            setActiveTab(currentTab);
        }
    };

    /* ================= TAB CLICK ================= */
    const handleTabClick = (tab) => {
        setActiveTab(tab);

        const section = sectionRefs.current[tab];
        if (!section || !scrollContainerRef.current) return;

        const containerTop =
            scrollContainerRef.current.getBoundingClientRect().top;

        const sectionTop = section.getBoundingClientRect().top;

        scrollContainerRef.current.scrollBy({
            top: sectionTop - containerTop,
            behavior: 'smooth',
        });
    };

    /* ================= DATA ================= */
    const [trainingData, setTrainingData] = useState([]);
    const [qaPairs, setQaPairs] = useState([
        { id: 1, question: 'What is your return policy?', answer: '30-day return policy for all products.' },
        { id: 2, question: 'How do I reset my password?', answer: 'Click forgot password on login page.' },
        { id: 3, question: 'What payment methods do you accept?', answer: 'We accept all major credit cards and PayPal.' },
    ]);
    const [newQA, setNewQA] = useState({ question: '', answer: '' });

    /* ================= HANDLERS ================= */
    const handleAddQA = () => {
        if (!newQA.question || !newQA.answer) return;

        const updated = [...qaPairs, { id: Date.now(), ...newQA }];
        setQaPairs(updated);
        onUpdate?.(updated);
        setNewQA({ question: '', answer: '' });
    };

    const handleDeleteQA = (id) => {
        const updated = qaPairs.filter(q => q.id !== id);
        setQaPairs(updated);
        onUpdate?.(updated);
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.map(file => ({
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            uploadDate: new Date().toLocaleDateString(),
        }));

        const updated = [...trainingData, ...newFiles];
        setTrainingData(updated);
        onUpdate?.(updated);
    };

    const handleDeleteFile = (id) => {
        const updated = trainingData.filter(f => f.id !== id);
        setTrainingData(updated);
        onUpdate?.(updated);
    };
    return (
        <div className="main-content" >
            {/* Header */}
            <div style={{ marginLeft: "0px", marginRight: "auto", width: "90%" }} className='flex flex-col h-full  ' >

                <div className="flex gap-2 items-center ">

                    <div>
                        <h1 className="text-2xl font-bold text-black-500">Upload & Manage Training Q&A Configuration</h1>

                    </div>
                </div>
                <div className='heighligts my-4' >
                    <p className="text-sm text-gray-600 ">Upload training data and create Q&A pairs to improve model performance.</p>
                </div>

                <div className="flex flex-1  overflow-hidden">
                    {/* Sidebar Tabs */}



                    {/* Scrollable content */}
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto overflow-x-auto  hide-scrollbar"
                    >
                        {/* ================= Overview ================= */}
                        <div ref={(el) => (sectionRefs.current['Q&A Training'] = el)}>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-4">Add Q&A Pair</h4>
                                    <div className="space-y-4">
                                        <div className="input-group">
                                            <label className="label">Question</label>
                                            <input
                                                type="text"
                                                value={newQA.question}
                                                onChange={(e) => setNewQA({ ...newQA, question: e.target.value })}
                                                className="input"
                                                placeholder="What is your return policy?"
                                            />
                                        </div>

                                        <div className="input-group">
                                            <label className="label">Answer</label>
                                            <textarea
                                                value={newQA.answer}
                                                onChange={(e) => setNewQA({ ...newQA, answer: e.target.value })}
                                                className="input"
                                                rows="4"
                                                placeholder="We offer a 30-day return policy for all products..."
                                            />
                                        </div>

                                        <button
                                            onClick={handleAddQA}
                                            className="check-btn flex items-center gap-2"
                                        >
                                            <FiPlus /> Add Q&A Pair
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-4">Existing Q&A Pairs ({qaPairs.length})</h4>
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {qaPairs.map((qa) => (
                                            <div key={qa.id} className="p-4 border border-gray-200 rounded-lg">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="font-medium text-sm">Q: {qa.question}</div>
                                                        <div className="text-sm text-gray-600 mt-1">A: {qa.answer}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteQA(qa.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {qaPairs.length === 0 && (
                                            <div className="text-center py-8 text-gray-500">
                                                <FiFileText className="mx-auto text-3xl mb-2" />
                                                <p>No Q&A pairs added yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ================= Code Example ================= */}
                        {/* <div
                            ref={(el) => (sectionRefs.current['File Upload'] = el)}
                        >
                            <div className='my-10' >
                                <h4 className="font-semibold mb-4">File Uploading</h4>

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                                    <FiUpload className="mx-auto text-3xl text-gray-400 mb-4" />
                                    <h4 className="font-semibold mb-2">Upload Training Data</h4>
                                    <p className="text-sm text-gray-600 mb-4">Upload documents, spreadsheets, or text files</p>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="check-btn flex justify-center items-center gap-2"
                                    >
                                        <FiUpload /> Choose Files
                                    </label>
                                    <p className="text-xs text-gray-500 mt-2">Supports: PDF, DOC, TXT, CSV, JSON (Max 100MB)</p>
                                </div>

                                {trainingData.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-4">Uploaded Files ({trainingData.length})</h4>
                                        <div className="space-y-2">
                                            {trainingData.map((file) => (
                                                <div key={file.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <FiFileText className="text-gray-400" />
                                                        <div>
                                                            <div className="font-medium text-sm">{file.name}</div>
                                                            <div className="text-xs text-gray-500">
                                                                {Math.round(file.size / 1024)} KB • Uploaded {file.uploadDate}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button className="btn btn-secondary btn-sm">
                                                            <FiDownload /> Download
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteFile(file.id)}
                                                            className="btn btn-secondary btn-sm"
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div> */}

                        {/* ================= Pricing ================= */}
                        {/* <div
                            ref={(el) => (sectionRefs.current['Taxonomy'] = el)}
                            className="bg-white my-4"
                        >
                            <div>
                                <h4 className="font-semibold mb-4">Taxonomy Configuration</h4>
                                <p className="text-sm text-gray-600 mb-6">Define categories and classifications for your data.</p>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="input-group">
                                            <label className="label">Categories (comma-separated)</label>
                                            <textarea
                                                className="input"
                                                rows="4"
                                                placeholder="e.g., Technical Support, Billing, Account Issues, Feature Requests"
                                            />
                                        </div>

                                        <div className="input-group">
                                            <label className="label">Priority Levels</label>
                                            <div className="space-y-2">
                                                <label className="checkbox">
                                                    <input type="checkbox" defaultChecked />
                                                    Low
                                                </label>
                                                <label className="checkbox">
                                                    <input type="checkbox" defaultChecked />
                                                    Medium
                                                </label>
                                                <label className="checkbox">
                                                    <input type="checkbox" defaultChecked />
                                                    High
                                                </label>
                                                <label className="checkbox">
                                                    <input type="checkbox" defaultChecked />
                                                    Urgent
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="input-group">
                                            <label className="label">Tags</label>
                                            <input
                                                type="text"
                                                className="input"
                                                placeholder="Add tags separated by commas"
                                            />
                                        </div>

                                        <div className="input-group">
                                            <label className="label">Sentiment Analysis</label>
                                            <div className="space-y-2">
                                                <label className="checkbox">
                                                    <input type="checkbox" defaultChecked />
                                                    Positive/Negative/Neutral
                                                </label>
                                                <label className="checkbox">
                                                    <input type="checkbox" />
                                                    Emotion detection
                                                </label>
                                                <label className="checkbox">
                                                    <input type="checkbox" />
                                                    Intent classification
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div> */}

                    </div>


                </div>
            </div>
            {/* 

            <div>
              
                <div style={{ marginTop: "45%" }}  >
                    <nav className=" flex flex-col w-40  border-gray-200 overflow-y-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => handleTabClick(tab)}
                                className={`py-3 px-3 text-left  text-sm
                            border-l transition-all duration-300
                  ${activeTab === tab
                                        ? 'border-l-4 border-[#02b499]'
                                        : 'border-l-4 border-[#d0d7df]'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
            </div> */}

        </div>
    );
};

export default DataTraining;
