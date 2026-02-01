
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft } from 'lucide-react';

interface ModulePlaceholderProps {
  titleKey: string;
}

const ModulePlaceholder: React.FC<ModulePlaceholderProps> = ({ titleKey }) => {
  const { t } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col p-6">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-blue-600 font-bold mb-8 transition-all active:translate-x-[-4px]"
      >
        <ArrowLeft className="w-5 h-5" />
        {t('common.back')}
      </button>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-blue-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold mb-2">
          {t(`modules.${titleKey}.title`)}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.placeholder')}
        </p>
      </div>
    </div>
  );
};

export default ModulePlaceholder;
