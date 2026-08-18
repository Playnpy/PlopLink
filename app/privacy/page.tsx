export const metadata = {
  title: "Privacy Policy — PlopLink",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col items-center p-6 sm:p-10">
      <div className="w-full max-w-2xl space-y-8">
        <div className="pt-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Plop<span className="text-indigo-600">Link</span>
          </h1>
          <p className="mt-2 text-slate-500 font-medium">Privacy Policy</p>
          <p className="mt-1 text-xs text-slate-400">Last updated: {new Date().toISOString().slice(0, 10)}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 space-y-6 text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">What PlopLink is</h2>
            <p>
              PlopLink is a personal clipboard manager. It consists of a website (this site) and an optional Chrome
              extension that lets you quickly save or share copied content.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">What data is processed</h2>
            <p className="mb-2">PlopLink handles two kinds of content:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Your library items</strong> (text, links, images you save) are stored only in your browser&apos;s
                local storage, on your own device. They are never sent to any server unless you explicitly use the
                &quot;Send to my phone&quot; feature.
              </li>
              <li>
                <strong>Shared items</strong>: when you explicitly choose to share content (via the website or the
                Chrome extension), the selected content is sent to our database (hosted on Supabase) so it can be
                retrieved from another device by scanning a QR code or opening the generated link. Shared content is
                automatically deleted after 7 days.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">Chrome extension specifics</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>The extension reads your clipboard only when you open its popup or trigger it manually.</li>
              <li>
                Clipboard content is never sent anywhere automatically — it is only transmitted if you click
                &quot;Add to library&quot; (which opens the PlopLink website with the content pre-filled) or &quot;Send to my
                phone&quot; (which sends it to our API to create a temporary share).
              </li>
              <li>
                The extension stores one non-sensitive setting locally (the PlopLink site URL) using the browser&apos;s
                <code className="mx-1 px-1 bg-slate-100 rounded">storage</code> permission. No personal data is stored
                by the extension itself.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">Third parties</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Supabase</strong> hosts the database used to store temporary shares. See{" "}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Supabase&apos;s privacy policy
                </a>
                .
              </li>
              <li>
                <strong>api.qrserver.com</strong> is used to generate the QR code image for a share link. It receives
                the share link itself, but never the shared content.
              </li>
              <li>
                <strong>Vercel</strong> hosts this website. See{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Vercel&apos;s privacy policy
                </a>
                .
              </li>
            </ul>
            <p className="mt-2">
              We do not sell or share your data with advertisers, and we do not use any analytics or tracking
              scripts.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">Data retention and deletion</h2>
            <p>
              Library items live only in your browser&apos;s local storage until you delete them or clear your browser
              data. Shared items are automatically deleted from our database 7 days after creation.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">Contact</h2>
            <p>For any question about this policy, contact: [your email address]</p>
          </section>
        </div>
      </div>
    </div>
  );
}
