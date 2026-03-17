import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-400/5 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-400 text-sm mb-8">
          <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
          חינם לחלוטין • ללא הרשמה
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 max-w-3xl">
          כמה <span className="gold-text">בריא</span> הכסף שלך?
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
          פנסיה, נדל״ן, השקעות, חסכונות, הלוואות — הכל במקום אחד.
          <br />
          תענה על כמה שאלות, קבל ציון מ-0 עד 100.
        </p>

        {/* CTA */}
        <Link
          href="/check"
          className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gold-400 hover:bg-gold-500 text-dark-500 font-bold text-xl rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,168,67,0.3)]"
        >
          התחל בדיקה חינמית
          <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
        </Link>

        <p className="text-slate-500 text-sm mt-4">
          לוקח כ-10 דקות • הנתונים לא נשמרים
        </p>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">איך זה עובד?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { num: "01", title: "תענה על שאלות", desc: "9 קטגוריות שמכסות את כל התמונה הפיננסית שלך", icon: "📝" },
            { num: "02", title: "קבל ציון מותאם", desc: "AI מנתח את הנתונים שלך ומייצר ציון מ-0 עד 100 עם תובנות בעברית", icon: "🧠" },
            { num: "03", title: "גלה מה לשפר", desc: "סימולטור אינטרקטיבי שמראה איך כל שינוי משפיע על העתיד שלך", icon: "🎯" },
          ].map((step) => (
            <div key={step.num} className="glass-card p-8 relative group hover:border-gold-400/30 transition-colors">
              <span className="absolute -top-4 right-6 text-gold-400/20 text-6xl font-black">{step.num}</span>
              <span className="text-4xl mb-4 block">{step.icon}</span>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What we analyze */}
      <section className="px-6 py-20 border-t border-dark-border/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">מה אנחנו בודקים?</h2>
          <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">לא רק פנסיה. אנחנו מסתכלים על כל התמונה — כי הכסף שלך לא חי בסילו</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: "🏦", label: "פנסיה וקרן השתלמות" },
              { icon: "🏠", label: "נדל״ן ומשכנתא" },
              { icon: "📈", label: "השקעות ותיק מניות" },
              { icon: "₿", label: "קריפטו" },
              { icon: "🏧", label: "חסכונות וקרן חירום" },
              { icon: "💳", label: "הלוואות וחובות" },
              { icon: "🛡️", label: "ביטוח והגנה" },
              { icon: "📊", label: "תזרים חודשי" },
              { icon: "🎯", label: "התאמה ליעדים" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-4 rounded-xl bg-dark-50/50 border border-dark-border/30">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-dark-border/20 text-center">
        <p className="text-slate-500 text-sm max-w-2xl mx-auto">
          מידע כללי בלבד. אינו מהווה ייעוץ פנסיוני, ייעוץ השקעות, או המלצה לפעולה כלשהי. לקבלת ייעוץ מותאם אישית, פנה/י ליועץ פנסיוני מורשה.
        </p>
        <p className="text-slate-600 text-xs mt-4">
          WealthIQ © {new Date().getFullYear()} • נבנה על ידי Lior
        </p>
      </footer>
    </main>
  );
}
