import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function InstallPrompt() {
  const { t } = useTranslation()
  const [deferred, setDeferred] = useState<any>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onBeforeInstall = (e: any) => {
      e.preventDefault(); setDeferred(e); setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 inset-x-0 px-4 z-40">
      <div className="glass rounded-2xl px-4 py-3 mx-auto max-w-[800px] flex items-center justify-between gap-3">
        <div className="text-sm opacity-90">{t('install.tip')}</div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-xl bg-black/10 dark:bg-white/10" onClick={async ()=>{ await deferred.prompt(); setVisible(false) }}>{t('install.add')}</button>
          <button className="px-3 py-1.5 rounded-xl bg-black/10 dark:bg-white/10" onClick={()=>setVisible(false)}>{t('install.close')}</button>
        </div>
      </div>
    </div>
  )
}