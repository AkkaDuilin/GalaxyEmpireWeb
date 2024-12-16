// app/login/page.js
'use client';

import React, { useState, useEffect } from 'react';
import styles from '../../styles/login.module.css';  // 引入样式模块

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false); // 用于标识是否为客户端渲染

  // 在 useEffect 中确认客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username === 'admin' && password === 'password') {
      alert('登录成功！');
    } else {
      setError('用户名或密码错误');
    }
  };

  if (!isClient) {
    // 如果是服务器端渲染时，避免渲染客户端特有的部分
    return null;
  }

  return (
    <div className={styles.loginContainer}>
      <h2>用户登录</h2>
      <form onSubmit={handleLogin}>
        <div className={styles.inputGroup}>
          <label htmlFor="username">用户名</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入用户名"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">密码</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.loginBtn}>登录</button>
      </form>
    </div>
  );
};

export default Login;
