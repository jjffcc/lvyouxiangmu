import { useEffect, useState } from "react";
import TripsApp from "./TripsApp.jsx";

function Brand() {
  return (
    <div className="login-brand">
      <span className="login-brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 3.5 14.4 10l6.1 2-6.1 2L12 20.5 9.6 14l-6.1-2 6.1-2L12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="1.7" fill="currentColor" />
        </svg>
      </span>
      <span>
        <strong>途见</strong>
        <small>TRIP JOURNAL</small>
      </span>
    </div>
  );
}

function StoryPanel() {
  return (
    <div className="login-story">
      <Brand />
      <div className="login-story-copy">
        <span className="login-kicker">A LITTLE TRIP, A LOT TO REMEMBER</span>
        <h1>把想去的地方，<br />慢慢变成一段旅程。</h1>
        <p>整理目的地、每日安排和出发准备，让旅行计划清楚一点，出发也安心一点。</p>
      </div>
      <div className="login-map" aria-hidden="true">
        <span className="login-map-line" />
        <i className="login-map-pin pin-one" />
        <i className="login-map-pin pin-two" />
        <i className="login-map-pin pin-three" />
        <span className="login-map-label">下一站，由你决定</span>
      </div>
      <div className="login-story-foot">
        <span>从灵感到出发，一页慢慢规划</span>
        <span>发现目的地 · 规划下一站</span>
      </div>
    </div>
  );
}

function AuthFrame({ children }) {
  return (
    <main className="login-page">
      <StoryPanel />
      <section className="login-side">
        <div className="login-card">
          <div className="login-card-brand"><Brand /></div>
          {children}
        </div>
        <div className="login-footer">途见 · 为下一段旅程做好准备</div>
      </section>
    </main>
  );
}

function AuthField({ id, label, name, type = "text", value, onChange, autoComplete, error, hint, inputMode }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword && visible ? "text" : type;

  return (
    <div className="login-field">
      <label htmlFor={id}>{label}</label>
      <div className={isPassword ? "login-password-wrap" : undefined}>
        <input
          id={id}
          name={name}
          type={actualType}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={[hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined}
          required
        />
        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "隐藏密码" : "显示密码"}
          >
            {visible ? "隐藏" : "显示"}
          </button>
        )}
      </div>
      {hint && <small id={`${id}-hint`} className="auth-field-hint">{hint}</small>}
      {error && <small id={`${id}-error`} className="auth-field-error" role="alert">{error}</small>}
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("login");
  const [account, setAccount] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then(async (response) => {
        if (response.ok) {
          const result = await response.json();
          if (active) setAccount(result.account);
        } else if (response.status !== 401 && active) {
          setMessage("暂时无法验证登录状态，请稍后重试。");
        }
      })
      .catch(() => {
        if (active) setMessage("暂时无法连接登录服务，请稍后重试。");
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function switchMode(nextMode) {
    setMode(nextMode);
    setFieldErrors({});
    setMessage("");
    setPassword("");
    setConfirmPassword("");
  }

  async function register(event) {
    event.preventDefault();
    setFieldErrors({});
    setMessage("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity, password, confirmPassword }),
      });
      const result = await response.json();
      if (!response.ok) {
        setFieldErrors(result.fieldErrors || {});
        setMessage(result.message || "暂时无法创建账户，请检查填写内容后重试。");
        return;
      }
      setPassword("");
      setConfirmPassword("");
      setMode("login");
      setMessage("账户已创建，请使用注册信息登录。");
    } catch {
      setMessage("暂时无法连接注册服务，请稍后重试。");
    } finally {
      setSubmitting(false);
    }
  }

  async function login(event) {
    event.preventDefault();
    setFieldErrors({});
    setMessage("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity, password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.message || "登录失败，请检查账号和密码后重试。");
        return;
      }
      setPassword("");
      setAccount(result.account);
    } catch {
      setMessage("暂时无法连接登录服务，请稍后重试。");
    } finally {
      setSubmitting(false);
    }
  }

  async function logout() {
    setMessage("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.message || "退出失败，请稍后重试。");
        return;
      }
      setAccount(null);
      setMode("login");
      setIdentity("");
      setPassword("");
      setConfirmPassword("");
      setFieldErrors({});
    } catch {
      setMessage("暂时无法连接登录服务，请稍后重试。");
    } finally {
      setSubmitting(false);
    }
  }

  if (checkingSession) {
    return (
      <AuthFrame>
        <span className="login-eyebrow">WELCOME TO YOUR JOURNEY</span>
        <h2>正在恢复登录状态</h2>
        <p className="login-lead" role="status" aria-live="polite">{message || "请稍候…"}</p>
      </AuthFrame>
    );
  }

  if (account) {
    return <TripsApp key={account.id} account={account} onLogout={logout} logoutPending={submitting} message={message} />;
  }

  return (
    <AuthFrame>
      <span className="login-eyebrow">WELCOME TO YOUR JOURNEY</span>
      <h2>{mode === "register" ? "创建账户" : "欢迎回来"}</h2>
      <p className="login-lead">
        {mode === "register" ? "使用邮箱或中国大陆手机号注册。" : "登录后，继续整理你的旅行计划。"}
      </p>
      <form className="auth-form" onSubmit={mode === "register" ? register : login} noValidate>
        <AuthField
          id="auth-identity"
          label="邮箱或手机号"
          name="identity"
          value={identity}
          onChange={(event) => setIdentity(event.target.value)}
          autoComplete={mode === "register" ? "username" : "username"}
          inputMode="text"
          error={fieldErrors.identity}
        />
        <AuthField
          id="auth-password"
          label="密码"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          hint={mode === "register" ? "密码长度为 8–64 个字符。" : undefined}
          error={fieldErrors.password}
        />
        {mode === "register" && (
          <AuthField
            id="auth-confirm-password"
            label="确认密码"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            error={fieldErrors.confirmPassword}
          />
        )}
        <p className="login-message" role="status" aria-live="polite">{message}</p>
        <button className="btn primary login-submit" type="submit" disabled={submitting}>
          {submitting ? mode === "register" ? "正在创建…" : "正在登录…" : mode === "register" ? "创建账户" : "登录并进入"}
        </button>
      </form>
      <p className="auth-switch">
        {mode === "register" ? "已经有账户？" : "还没有账户？"}
        <button type="button" onClick={() => switchMode(mode === "register" ? "login" : "register")}>
          {mode === "register" ? "返回登录" : "注册账户"}
        </button>
      </p>
    </AuthFrame>
  );
}
