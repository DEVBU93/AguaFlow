import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3002';

interface Config {
  github_token: string; github_org: string;
  notion_token: string;
  linear_key: string;
  slack_token: string;
  asana_token: string; asana_workspace: string;
  jira_host: string; jira_email: string; jira_token: string;
}

export default function NewAnalysisPage() {
  const [companyName, setCompanyName] = useState('');
  const [config, setConfig] = useState<Config>({
    github_token: '', github_org: '',
    notion_token: '',
    linear_key: '',
    slack_token: '',
    asana_token: '', asana_workspace: '',
    jira_host: '', jira_email: '', jira_token: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (field: keyof Config) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setConfig(c => ({ ...c, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName) { toast.error('Nombre de empresa requerido'); return; }
    setLoading(true);
    try {
      // Create company
      const companyRes = await fetch(`${API}/api/analysis/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: companyName })
      });
      const companyData = await companyRes.json();

      // Build config
      const analysisConfig: any = {};
      if (config.github_token) analysisConfig.github = { token: config.github_token, org: config.github_org || undefined, username: config.github_org ? undefined : 'DEVBU93' };
      if (config.notion_token) analysisConfig.notion = { token: config.notion_token };
      if (config.linear_key) analysisConfig.linear = { apiKey: config.linear_key };
      if (config.slack_token) analysisConfig.slack = { token: config.slack_token };
      if (config.asana_token) analysisConfig.asana = { token: config.asana_token, workspaceGid: config.asana_workspace };

      const analysisRes = await fetch(`${API}/api/analysis/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: companyData.data.id, config: analysisConfig })
      });
      const analysisData = await analysisRes.json();
      toast.success('¡Análisis iniciado!');
      navigate(`/analysis/${analysisData.data.analysisId}`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors text-sm";

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Nuevo Análisis AGUA FLOW</h1>
      <p className="text-slate-400 mb-8">Conecta tus herramientas para obtener un análisis completo</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="font-semibold text-white mb-4">Empresa</h2>
          <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Nombre de la empresa" className={inputClass} required />
        </div>

        {[
          { title: '⚙️ GitHub', fields: [{ key: 'github_token', label: 'Token', placeholder: 'ghp_...' }, { key: 'github_org', label: 'Org/Username', placeholder: 'DEVBU93' }] },
          { title: '📄 Notion', fields: [{ key: 'notion_token', label: 'Token', placeholder: 'secret_...' }] },
          { title: '📊 Linear', fields: [{ key: 'linear_key', label: 'API Key', placeholder: 'lin_api_...' }] },
          { title: '💬 Slack', fields: [{ key: 'slack_token', label: 'Bot Token', placeholder: 'xoxb-...' }] },
          { title: '✅ Asana', fields: [{ key: 'asana_token', label: 'Token', placeholder: 'Personal Access Token' }, { key: 'asana_workspace', label: 'Workspace GID', placeholder: '1213129123318861' }] }
        ].map(({ title, fields }) => (
          <div key={title} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 className="font-semibold text-white mb-4">{title} <span className="text-xs text-slate-500 font-normal">(opcional)</span></h2>
            <div className="space-y-3">
              {fields.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
                  <input
                    type={key.includes('token') || key.includes('key') ? 'password' : 'text'}
                    value={(config as any)[key]}
                    onChange={set(key as keyof Config)}
                    placeholder={placeholder}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors text-lg">
          {loading ? 'Analizando...' : '🌊 Iniciar Análisis AGUA FLOW'}
        </button>
      </form>
    </div>
  );
}
