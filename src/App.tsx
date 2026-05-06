import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import TerminalOS from './TerminalOS';
import Python from './kernels/Python';
import JavaScript from './kernels/JavaScript';
import Rust from './kernels/Rust';
import C from './kernels/C';
import Cpp from './kernels/Cpp';
import Go from './kernels/Go';
import Csharp from './kernels/Csharp';
import Zig from './kernels/Zig';
import Ruby from './kernels/Ruby';
import PHP from './kernels/PHP';
import TypeScript from './kernels/TypeScript';
import Kotlin from './kernels/Kotlin';
import Dart from './kernels/Dart';
import Swift from './kernels/Swift';
import SQL from './kernels/SQL';
import StandaloneFileManager from './StandaloneFileManager';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:lang" element={<LandingPage />} />
        <Route path="/terminal" element={<TerminalOS />} />
        <Route path="/kernel/terminalos" element={<TerminalOS />} />
        <Route path="/kernel/python" element={<Python />} />
        <Route path="/kernel/javascript" element={<JavaScript />} />
        <Route path="/kernel/rust" element={<Rust />} />
        <Route path="/kernel/c" element={<C />} />
        <Route path="/kernel/cpp" element={<Cpp />} />
        <Route path="/kernel/go" element={<Go />} />
        <Route path="/kernel/csharp" element={<Csharp />} />
        <Route path="/kernel/zig" element={<Zig />} />
        <Route path="/kernel/ruby" element={<Ruby />} />
        <Route path="/kernel/php" element={<PHP />} />
        <Route path="/kernel/typescript" element={<TypeScript />} />
        <Route path="/kernel/kotlin" element={<Kotlin />} />
        <Route path="/kernel/dart" element={<Dart />} />
        <Route path="/kernel/swift" element={<Swift />} />
        <Route path="/kernel/sql" element={<SQL />} />
        <Route path="/standalone-file-manager" element={<StandaloneFileManager />} />
      </Routes>
    </BrowserRouter>
  );
}
