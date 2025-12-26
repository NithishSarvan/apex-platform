import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Overview from './components/Overview/Overview';
import DataTraining from './pages/DataTraining';
import WorkflowBuilder from './pages/WorkflowBuilder';
import DataSources from './pages/DataSources';
import RulesSetupStep from './components/RulesSetupStep';
import ModelCatalog from './components/ModelCatalog/ModelCatalog';
import ModelDetails from './components/ModelCatalog/ModelDetails';
import Providers from './pages/Providers';
import Chate from './pages/playground/Chate';
import Realtime from './pages/playground/Realtime';
import SettingsTabs from './pages/SettingsTabs';
import ModelTrainingTab from './components/ModelTrainingTabs/ModelTrainingTab';
import AIOperatingSystemDashboard from './pages/newflow/AIOperatingSystemDashboard';
import AIOSEnterpriseDashboard from './pages/newflow/AIOperatingSystemDashboard';
import ModelTrainingList from './components/ModelTrainingTabs/ModelTrainingList';
import { ApiPlaygroundPage } from './pages/playground/ApiPlayground';



function App() {



  const [activeView, setActiveView] = useState('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);


  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);


  const basename =
    process.env.NODE_ENV === 'production'
      ? '/apex-platform'
      : '/';

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (


    <BrowserRouter basename={basename}>
      <div className="app">
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />


        <div className="main-container">
          <Sidebar
            activeView={activeView}
            setActiveView={setActiveView}
            collapsed={sidebarCollapsed}
          />

          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/models" element={<ModelCatalog />} />
            <Route path="/settings" element={<SettingsTabs />} />
            <Route path="/chat" element={<Chate />} />
            <Route path='/realtime' element={<Realtime />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/data-training" element={<ModelTrainingTab />} />
            <Route path="/workflows" element={<WorkflowBuilder />} />
            <Route path="/data-sources" element={<DataSources />} />
            <Route path="/rules-setup" element={<RulesSetupStep />} />
            <Route path="/model-details" element={<ModelDetails />} />
            <Route path="/aios" element={<AIOperatingSystemDashboard />} />
            <Route path="/model-training" element={<ModelTrainingList />} />
            <Route path="/api-playground" element={<ApiPlaygroundPage />} />
            {/* <Route path="/aios" element={<AIOSEnterpriseDashboard />} /> */}
            {/* <Route path="/clients" element={<Clients />} /> */}
          </Routes>

        </div>

      </div>
    </BrowserRouter >
  );
}

export default App;


// <div className="app">
//   <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

//   <div className="main-container">
//     <Sidebar
//       activeView={activeView}
//       setActiveView={setActiveView}
//       collapsed={sidebarCollapsed}
//     />

//     {activeView === 'catalog' ? (

//       <ModelCatalog
//         showFilters={showFilters}
//         setShowFilters={setShowFilters}
//       />
//     ) : (
//       <Overview />
//     )}
//     {/* <ModelDetails /> */}
//   </div>
// </div>