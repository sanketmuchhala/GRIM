import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useGameStore } from './game/state';
import Lobby from './routes/Lobby';
import Table from './routes/Table';
import Rules from './routes/Rules';

function App() {
  const { coinToss } = useGameStore();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route 
          path="/table" 
          element={coinToss ? <Table /> : <Navigate to="/" replace />} 
        />
        <Route path="/rules" element={<Rules />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
