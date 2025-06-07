'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CookieContextType {
  cookie: string;
  isLoaded: boolean;
  hasCookie: boolean;
  saveCookie: (newCookie: string) => boolean;
  clearCookie: () => boolean;
  validateCookie: (cookieStr: string) => boolean;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export function CookieProvider({ children }: { children: React.ReactNode }) {
  const [cookie, setCookie] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  // 从 localStorage 加载 cookie
  useEffect(() => {
    try {
      const savedCookie = localStorage.getItem('xiaohongshu_cookie');
      if (savedCookie) {
        setCookie(savedCookie);
      }
    } catch (error) {
      console.error('加载 Cookie 失败:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 保存 cookie 到 localStorage
  const saveCookie = (newCookie: string) => {
    try {
      setCookie(newCookie);
      if (newCookie.trim()) {
        localStorage.setItem('xiaohongshu_cookie', newCookie);
      } else {
        localStorage.removeItem('xiaohongshu_cookie');
      }
      return true;
    } catch (error) {
      console.error('保存 Cookie 失败:', error);
      return false;
    }
  };

  // 清除 cookie
  const clearCookie = () => {
    try {
      setCookie('');
      localStorage.removeItem('xiaohongshu_cookie');
      return true;
    } catch (error) {
      console.error('清除 Cookie 失败:', error);
      return false;
    }
  };

  // 验证 cookie 格式
  const validateCookie = (cookieStr: string): boolean => {
    if (!cookieStr.trim()) return false;
    
    // 基本的 cookie 格式验证
    const cookiePairs = cookieStr.split(';');
    for (const pair of cookiePairs) {
      const [key, value] = pair.split('=');
      if (!key?.trim() || value === undefined) {
        return false;
      }
    }
    return true;
  };

  const value: CookieContextType = {
    cookie,
    isLoaded,
    hasCookie: cookie.trim().length > 0,
    saveCookie,
    clearCookie,
    validateCookie
  };

  return (
    <CookieContext.Provider value={value}>
      {children}
    </CookieContext.Provider>
  );
}

export function useCookieStorage() {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error('useCookieStorage must be used within a CookieProvider');
  }
  return context;
} 