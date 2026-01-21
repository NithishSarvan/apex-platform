import React from 'react';
import {
    FiGrid,
    FiTarget,
    FiDatabase,
    FiSliders,
    FiGitMerge,
    FiHelpCircle,
    FiCheck,
    FiChevronLeft,
    FiChevronRight,
    FiHome
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
const Overview = () => {

    const navigate = useNavigate();

    const settings = {
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        dots: true,
        infinite: true
    };

    return (
        <div className="main-content" >

            <div className="hero-section" >

                <div className="hero-content">
                    <h1>Start Your AI Journey</h1>
                    <p>
                        Compass is a cutting-edge AI platform designed to elevate productivity
                        and drive smarter decision-making.
                    </p>
                    <button className="explore-btn" onClick={() => navigate('/models')}>Explore models</button>
                </div>



                <Slider {...settings} className="hero-card">
                    <div>
                        <h3>GPT-5</h3>
                        <p>Advanced model with enhanced understanding, reasoning, and generating human-like responses. it including writing, problem-solving, and conversation.</p>
                        <button className="check-btn" onClick={() => navigate('/model-details', {
                            state: {
                                modelName: 'GPT-5',
                                overview: 'Advanced model with enhanced understanding, reasoning, and generating human-like responses. it including writing, problem-solving, and conversation.',
                            },
                        })}>Check it out </button>
                    </div>

                    <div>
                        <h3>GPT-4.5</h3>
                        <p>GPT-4.5  offers faster performance making it ideal for well-defined tasks and clear, focused prompts.</p>
                        <button className="check-btn" onClick={() => navigate('/model-details', {
                            state: {
                                modelName: 'GPT-4.5',
                                overview: 'GPT-4.5 Advanced model with enhanced understanding, reasoning, and generating human-like responses. it including writing, problem-solving, and conversation.',
                            },
                        })}>Check it out </button>
                    </div>
                </Slider>

            </div>

            <div className='overview'>
                <div className="card-container" style={{ border: "1px solid #d0d7df "}} >
                    <div className='card-head-title' >
                        <div className="card-icon-wrapper mb-3">
                            <FiDatabase size={30} />
                        </div>

                        <h1 className="card-title">Explore AI Capabilities</h1>
                    </div>


                    <p className="card-description">
                        Connect and integrate external data sources to enable real-time access and retrieval of
                        information.This allows to seamlessly pull and update data from multiple systems, databases, or APIs
                    </p>

                    <button className="card-button" onClick={() => navigate('/chat')}>Try Playground</button>
                </div>

                <div className="card-container" style={{ border: "1px solid #d0d7df  "}} >
                    <div className='card-head-title' >
                        <div className="card-icon-wrapper mb-3">
                            <FiSliders size={30} />

                        </div>

                        <h2 className="card-title">Seamless Inference</h2>
                    </div>
                    <p className="card-description">
                        Seamless Inference
                        Efficiently manage batch processing with high-throughput performance, ensuring fast, reliable API execution for every job. Keep your operations running smoothly and your users always connected.                    </p>

                    <button className="card-button" onClick={() => navigate('/providers')}>Manage Interfase</button>
                </div>
            </div>
            <div className='overview'>
                <div className="card-container" style={{ border: "1px solid #d0d7df  "}}
                >
                    <div className='card-head-title' >
                        <div className="card-icon-wrapper mb-3">
                            <FiSliders size={30} />

                        </div>

                        <h2 className="card-title">Customize with Fine-Tuning</h2>
                    </div>
                    <p className="card-description">
                        Train models with your data to get more relevant results. Leverage powerful pretrained models as a foundation, then fine-tune them to improve performance for your specific tasks, domains, or workflows.                    </p>

                    <button className="card-button" onClick={() => navigate('/data-training')}>Explore</button>
                </div>

                <div className="card-container" style={{ border: "1px solid #d0d7df  "}} >
                    <div className='card-head-title' >
                        <div className="card-icon-wrapper mb-3">
                            <FiDatabase size={30} />
                        </div>

                        <h1 className="card-title">Data Source</h1>
                    </div>


                    <p className="card-description">
                        Connect and integrate external data sources to enable real-time access and retrieval of information.This allows to seamlessly pull and update data from multiple systems, databases, or APIs.
                    </p>

                    <button className="card-button" onClick={() => navigate('/data-sources')}>Setup</button>
                </div>
            </div>



        </div >
    );
};

export default Overview;
