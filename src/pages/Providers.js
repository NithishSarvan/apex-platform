import { Box, Grid, Typography } from '@mui/material'
import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


import gpt from "../assets/gpt-JRKBi7sz.svg"
import meta from "../assets/meta-svg.svg"
import mbzuai from "../assets/mbzuai.svg"
import inception from "../assets/inception.svg"
import mistral from "../assets/mistral.svg"
import stablediffusion from "../assets/stablediffusion.png"
import anthropicCalude from "../assets/anthropicCalude.svg"
import deepseek from "../assets/deepseek.svg"
import qwen from "../assets/qwen.svg"
import cohere from "../assets/cohere.svg"
import xai from "../assets/xai.svg"


const Providers = () => {

    const models = [
        { name: "OpenAI", count: 26, img: gpt },
        { name: "ChatGPT", count: 10, img: meta },
        { name: "DALL·E", count: 5, img: gpt },
        { name: "Whisper", count: 3, img: gpt },
        { name: "Codex", count: 7, img: gpt },
        { name: "CLIP", count: 2, img: gpt }
    ];

    return (
        <div className="main-content " >
            <div className='' >
                <h1 class="text-xl my-2 font-bold text-black-500" >Leading Providers in the AI Industry</h1>
                <p>Choose from the industry's leading LLM providers to harness the full potential of AI tailored to your business needs. Our curated selection ensures access to the most advanced, reliable, scalable language models driving real-world results.</p>
            </div>





            <TableContainer sx={{ maxWidth: "100%", margin: 'auto', mt: 4 }}>
                <Table
                    sx={{
                        border: '1px solid #ccc',             // outer border
                        '& th, & td': { border: '2px solid #ccc' }  // inner borders
                    }}
                >

                    <TableBody>
                        <TableRow  >
                            <TableCell   >
                                <Box sx={{ p: 3 }} >
                                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }} >
                                        <img src={gpt} width={60} height={60} alt={gpt} />
                                        <h5 className='font-semibold text-xl' >OpenAI</h5>
                                    </Box>
                                    <p className='text-sm '  >OpenAI | 26 Models</p>
                                </Box>
                            </TableCell>
                            <TableCell  >
                                <Box sx={{ p: 3 }} >
                                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }} >
                                        <img src={meta} width={60} height={60} alt={gpt} />
                                        <h5 className='font-semibold text-xl' >Meta</h5>
                                    </Box>
                                    <p className='text-sm '>Meta | 3 Models</p>
                                </Box>
                            </TableCell>
                        </TableRow>
                        <TableRow  >
                            <TableCell   >
                                <Box sx={{ p: 3 }} >
                                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }} >
                                        <img src={mbzuai} width={60} height={60} alt={mbzuai} />
                                        <h5 className='font-semibold text-xl' >MBZUAI</h5>
                                    </Box>
                                    <p className='text-sm '  >MBZUAI | 2 Models</p>
                                </Box>
                            </TableCell>
                            <TableCell  >
                                <Box sx={{ p: 3 }} >
                                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }} >
                                        <img src={inception} width={60} height={60} alt={gpt} />
                                        <h5 className='font-semibold text-xl' >Inception</h5>
                                    </Box>
                                    <p className='text-sm '  >Inception | 1 Models</p>
                                </Box>
                            </TableCell>
                        </TableRow>
                        <TableRow  >
                            <TableCell   >
                                <Box sx={{ p: 3 }} >
                                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }} >
                                        <img src={mistral} width={60} height={60} alt={mistral} />
                                        <h5 className='font-semibold text-xl' >Mistral AI</h5>
                                    </Box>
                                    <p className='text-sm '  >mistral | 3 Models</p>
                                </Box>
                            </TableCell>
                            <TableCell  >
                                <Box sx={{ p: 3 }} >
                                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }} >
                                        <img src={stablediffusion} width={60} height={60} alt={stablediffusion} />
                                        <h5 className='font-semibold text-xl' >Stability AI</h5>
                                    </Box>
                                    <p className='text-sm '  >Stability AI | 1 Models</p>
                                </Box>
                            </TableCell>
                        </TableRow>
                        <TableRow  >
                            <TableCell   >
                                <Box sx={{ p: 3 }} >
                                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }} >
                                        <img src={anthropicCalude} width={60} height={60} alt={anthropicCalude} />
                                        <h5 className='font-semibold text-xl' >Anthropic</h5>
                                    </Box>
                                    <p className='text-sm '  >Anthropic | 1 Models</p>
                                </Box>
                            </TableCell>
                            <TableCell  >
                                <Box sx={{ p: 3 }} >
                                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }} >
                                        <img src={deepseek} width={60} height={60} alt={deepseek} />
                                        <h5 className='font-semibold text-xl' >DeepSeek</h5>
                                    </Box>
                                    <p className='text-sm '  >DeepSeek | 1 Models</p>
                                </Box>
                            </TableCell>
                        </TableRow>
                        <TableRow  >
                            <TableCell   >
                                <Box sx={{ p: 3 }} >
                                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }} >
                                        <img src={qwen} width={60} height={60} alt={qwen} />
                                        <h5 className='font-semibold text-xl' >Qwen</h5>
                                    </Box>
                                    <p className='text-sm '  >Qwen | 3 Models</p>
                                </Box>
                            </TableCell>
                            <TableCell  >
                                <Box sx={{ p: 3 }} >
                                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }} >
                                        <img src={cohere} width={60} height={60} alt={gpt} />
                                        <h5 className='font-semibold text-xl' >Cohere</h5>
                                    </Box>
                                    <p className='text-sm '  >Cohere | 4 Models</p>
                                </Box>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>  {/* This cell will span 2 columns */}
                                <Box sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }}>
                                        <img src={xai} width={60} height={60} alt="xAI" />
                                        <h5 className='font-semibold text-xl'>xAI</h5>
                                    </Box>
                                    <p className='text-sm'>xAI | 1 Models</p>
                                </Box>
                            </TableCell>
                        </TableRow>

                    </TableBody>
                </Table>
            </TableContainer>



        </div>
    )
}

export default Providers