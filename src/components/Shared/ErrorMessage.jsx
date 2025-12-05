import { AlertTriangle, X } from 'lucide-react';

const ErrorMessage = ({ message, onClose, type = 'error' }) => {
  const typeStyles = {
    error: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200'
  };

  const icons = {
    error: <AlertTriangle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <AlertTriangle className="h-5 w-5" />
  };

  return (
    <div className={`p-4 rounded-md border flex items-center space-x-2 ${typeStyles[type]}`}>
      {icons[type]}
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;