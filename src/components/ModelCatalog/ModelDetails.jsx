import React, { useState, useRef, useEffect } from 'react';
import { AiFillAccountBook, AiFillAndroid, AiFillBell, AiFillStar } from 'react-icons/ai';
import { CiImageOn, CiText } from 'react-icons/ci';
import { FiCheck, FiDatabase } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import TextIcon from "../../assets/svg-cons/text.svg";
import ConLengthIcon from "../../assets/svg-cons/con-length.svg";
import OptokenIcon from "../../assets/svg-cons/optoken.svg";

const ModelDetails = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { state } = useLocation();
    const { modelName, overview } = state || {};

    const scrollContainerRef = useRef(null);
    const sectionRefs = useRef({});
    const tabs = ['overview', 'code example', 'pricing', 'compute'];

    // ICONS SVG
    const TEXT_ICON_SRC = "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e...";


    // Scroll spy
    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const containerTop = scrollContainerRef.current.getBoundingClientRect().top;

        let currentTab = 'overview';
        for (const tab of tabs) {
            const section = sectionRefs.current[tab];
            if (section) {
                const offset = section.getBoundingClientRect().top - containerTop;
                if (offset <= 50) currentTab = tab;
            }
        }
        setActiveTab(currentTab);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        const section = sectionRefs.current[tab];
        if (section && scrollContainerRef.current) {
            const containerTop = scrollContainerRef.current.getBoundingClientRect().top;
            const sectionTop = section.getBoundingClientRect().top;
            scrollContainerRef.current.scrollBy({
                top: sectionTop - containerTop,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="main-content-model flex  gap-16 px-10   ">


            <div className='flex flex-col h-screen overflow-hidden' >
                <div className="flex gap-2 items-center ">
                    <div className="card-icon-wrapper ">
                        <AiFillStar size={30} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-black-500">{modelName}</h1>
                        <div className="flex space-x-3 mt-1">
                            <button className="check-btn">Subscribe</button>
                            <button className="try-btn">Try it out</button>
                        </div>
                    </div>
                </div>
                <div className='heighligts my-4  font-md' >
                    <p>The model details below will update automatically based on the Region, Compute, and Version filters you select.</p>
                </div>

                <div className="flex flex-1  overflow-hidden">
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto overflow-x-auto  hide-scrollbar"
                    >
                        {/* ================= Overview ================= */}
                        <div ref={(el) => (sectionRefs.current['overview'] = el)}>
                            <h2 className="text-xl font-bold mb-6">Overview</h2>

                            <p className=" mb-6 font-md" >{overview}</p>

                            <div className="overflow-x-auto mb-6">
                                <table className="min-w-full">
                                    <tbody className="bg-white">
                                        <tr className="border-b-2 border-gray-200">
                                            <td className="py-3 font-md  font-semibold">Input modalities</td>
                                            <td className="py-3  flex items-center gap-2">
                                                <div className="flex items-center gap-1 px-3 py-2 bg-[#eff2f3] roundedtext-block-800">
                                                    {/* <CiText size={20} /> */}
                                                    <img
                                                        src={TextIcon}
                                                        alt="text icon"
                                                        className="w-5 h-5"
                                                    />
                                                </div>
                                                Text
                                            </td>
                                            <td></td>
                                            <td className="py-3 px-4 flex items-center gap-2">
                                                <div className="flex items-center gap-1 px-3 py-2 bg-[#eff2f3] roundedtext-block-800">
                                                    <CiImageOn size={20} />
                                                </div>
                                                Images
                                            </td>
                                        </tr>
                                        <tr className="border-b-2 border-gray-200">
                                            <td className="py-3 font-md font-semibold">Output modalities</td>
                                            <td className="py-3  flex items-center gap-2">
                                                <div className="flex items-center gap-1 px-3 py-2 bg-[#eff2f3] roundedtext-block-800">
                                                    <img
                                                        src={TextIcon}
                                                        alt="text icon"
                                                        className="w-5 h-5"
                                                    />
                                                </div>
                                                Text
                                            </td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr className="border-b-2 border-gray-200">
                                            <td className="py-3 font-md font-semibold">Context length</td>
                                            <td className="py-3  flex items-center gap-2">
                                                <div className="flex items-center gap-1 px-3 py-2 bg-[#eff2f3] roundedtext-block-800">
                                                    <img
                                                        src={ConLengthIcon}
                                                        alt="text icon"
                                                        className="w-5 h-5"
                                                    />
                                                </div>
                                                128,000
                                            </td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr className="border-b-2 border-gray-200">
                                            <td className="py-3 font-mdfont-md font-semibold font-md" >Max output tokens</td>
                                            <td className="py-3  flex items-center gap-2">
                                                <div className="flex items-center gap-1 px-3 py-2 bg-[#eff2f3] roundedtext-block-800">
                                                    <img
                                                        src={OptokenIcon}
                                                        alt="text icon"
                                                        className="w-5 h-5"
                                                    />
                                                </div>
                                                16,384
                                            </td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ================= Code Example ================= */}
                        <div
                            ref={(el) => (sectionRefs.current['code example'] = el)}
                        >
                            <div>
                                <h2 className="text-lg font-semibold mb-4">CODE EXAMPLE</h2>

                                <div className="flex space-x-4 mb-6">
                                    <button className="check-btn">OPENAI</button>
                                    <button className="try-btn">AZURE</button>
                                </div>

                                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm text-gray-400">POST: https://api.core42.ai/v1/chat/completions HTTP/1.1</span>
                                        <button className="text-sm text-blue-400 hover:text-blue-300">Copy code</button>
                                    </div>
                                    <pre className="text-sm">
                                        {`{
  "model": "gpt-4o",
  "stream": false,
  "messages": [
    {
      "role": "user",
      "content": "Hello!"
    }
  ]
}`}</pre>
                                </div>
                            </div>
                        </div>

                        {/* ================= Pricing ================= */}
                        <div
                            ref={(el) => (sectionRefs.current['pricing'] = el)}
                            className="bg-white my-4"
                        >
                            <h2 className="text-xl font-bold mb-6">PRICING</h2>
                            <p className="font-md mb-6">Pricing is based on the number of tokens used.</p>

                            <div className="overflow-x-auto mb-8">
                                <table className="min-w-full">
                                    <thead>
                                        <tr style={{ display: "flex", justifyContent: "space-between" }} >
                                            <th className=" text-left text-lg font-bold text-block-700">Text tokens</th>
                                            <th className=" text-left text-sm font-bold text-[#676a6e]">Input</th>
                                            <th className="text-left text-sm font-bold text-[#676a6e]">Output</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr className="border-b-2" style={{ display: "flex", justifyContent: "space-between", borderColor: '#e6e8eb' }} >
                                            <td className=" py-2 text-sm text-[#676a6e]">Per 1M tokens&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                            <td className=" py-2 text-lg font-bold">$2.50</td>
                                            <td className=" py-2 text-lg font-bold">$10.00</td>
                                        </tr>
                                    </tbody>
                                    <thead className="border-b-2" style={{ borderColor: '#e6e8eb' }} >
                                        <tr  >
                                            <div className="flex justify-between items-center my-4">
                                                {/* Left Column */}
                                                <div>
                                                    <p className="text-lg font-bold text-block-700">Batch API</p>
                                                    <p className="text-sm text-[#676a6e]">Per 1M tokens</p>
                                                </div>

                                                {/* Right Column */}
                                                <div className="text-lg font-bold w-90 bg-red text-right">
                                                    50% discount on inputs and outputs tokens with the Batch
                                                </div>
                                            </div>


                                        </tr>
                                    </thead>


                                    <thead>
                                        <tr className="border-b-2 flex justify-between items-center" style={{ borderColor: '#e6e8eb' }}>
                                            <td className="text-lg font-bold text-block-700">
                                                Web Search<br />
                                                <span className="text-sm text-[#676a6e]">Per 1K transactions</span>
                                            </td>
                                            <td className="text-lg font-bold">$18.00</td>
                                            <td className="text-lg font-bold">$18.00</td>
                                        </tr>
                                    </thead>

                                </table>
                            </div>

                        </div>

                        {/* ================= Compute ================= */}
                        <div
                            ref={(el) => (sectionRefs.current['compute'] = el)}
                            className="bg-white rounded-lg shadow-sm  mb-6"
                        >
                            <h2 className="text-xl font-bold mb-4">COMPUTE</h2>
                            <p className="font-md">Compute configuration options will be displayed here.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                {/* <div className='scroll-nav' > */}
                <div style={{ marginTop: "45%" }}  >
                    <nav className=" flex flex-col w-40  border-gray-200 overflow-y-auto">
                        {['Overview', 'Code Example', 'Pricing', 'Compute'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTabClick(tab.toLowerCase())}
                                className={`py-3 px-3 text-left  text-sm
                            border-l transition-all duration-300
                            ${activeTab === tab.toLowerCase()
                                        ? 'border-l-4 border-[#02b499]'
                                        : 'border-l-4 border-[#d0d7df]'
                                    }`}

                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

        </div>
    );
};

export default ModelDetails;
