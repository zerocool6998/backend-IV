/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { LibraryPage } from './pages/LibraryPage';
import { SupportPage } from './pages/SupportPage';
import { ProductPage } from './pages/ProductPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { RefundPage } from './pages/RefundPage';
import { AboutPage } from './pages/AboutPage';
import { AuthorsPage } from './pages/AuthorsPage';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="product" element={<ProductPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="refund" element={<RefundPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="authors" element={<AuthorsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
