import { useApp } from '../context/AppContext';
import Toast from './Toast';

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp();
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      display: 'flex', flexDirection: 'column', gap: 10,
      zIndex: 2000
    }}>
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onDismiss={() => dismissToast(t.id)} />
      ))}
    </div>
  );
}
