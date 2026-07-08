"use client";

import { useState, useEffect, useRef } from "react";

interface PocketItem {
  id: string;
  category: "YouTube" | "Image" | "Liens web" | "Texte" | "Mail" | "Téléphone" | "Google Maps";
  content: string;
  title?: string;
  createdAt: string;
}

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  
  // 🔍 Nouvel état pour la barre de recherche
  const [searchQuery, setSearchQuery] = useState("");
  
  const categories = ["YouTube", "Image", "Liens web", "Mail", "Téléphone", "Google Maps", "Texte"] as const;
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>("Texte");
  
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 🔔 Message de notification (Toast)
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [openSidebarCategories, setOpenSidebarCategories] = useState<Record<string, boolean>>({});
  const [items, setItems] = useState<PocketItem[]>([]);
  const isLoaded = useRef(false);

  const categoryIcons: Record<typeof categories[number], string> = {
    YouTube: "📺",
    Image: "🖼️",
    "Liens web": "🌐",
    Mail: "✉️",
    Téléphone: "📞",
    "Google Maps": "📍",
    Texte: "📝",
  };

  // 📥 CHARGEMENT INITIAL
  useEffect(() => {
    const savedItems = localStorage.getItem("vide_poche_items");
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (e) {
        console.error("Erreur de lecture du cache", e);
      }
    }
    isLoaded.current = true;
  }, []);

  // 💾 SAUVEGARDE AUTOMATIQUE
  useEffect(() => {
    if (isLoaded.current) {
      localStorage.setItem("vide_poche_items", JSON.stringify(items));
    }
  }, [items]);

  // 🔍 LOGIQUE DE FILTRE : Filtre les éléments en fonction de la recherche
  const displayedItems = items.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true; // Si la recherche est vide, on affiche tout
    
    const matchesContent = item.content.toLowerCase().includes(query);
    const matchesTitle = item.title ? item.title.toLowerCase().includes(query) : false;
    const matchesCategory = item.category.toLowerCase().includes(query);

    return matchesContent || matchesTitle || matchesCategory;
  });

  const getYouTubeVideoTitle = (url: string): string => {
    try {
      const trimmed = url.trim();
      let videoId = "";
      if (trimmed.includes("v=")) {
        videoId = trimmed.split("v=")[1]?.split("&")[0] || "";
      } else if (trimmed.includes("youtu.be/")) {
        videoId = trimmed.split("youtu.be/")[1]?.split("?")[0] || "";
      }
      if (videoId === "dQw4w9WgXcQ") return "Rick Astley - Never Gonna Give You Up";
      return `Vidéo YouTube (${videoId || "Lien"})`;
    } catch (e) {
      return "Vidéo YouTube";
    }
  };

  const autoDetectCategory = (text: string) => {
    const trimmed = text.trim();
    if (trimmed.includes("http://googleusercontent.com/maps.google.com/") || trimmed.includes("goo.gl/maps")) {
      setSelectedCategory("Google Maps");
      return;
    }
    if (trimmed.includes("youtube.com/") || trimmed.includes("youtu.be/")) {
      setSelectedCategory("YouTube");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(trimmed)) {
      setSelectedCategory("Mail");
      return;
    }
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    if (phoneRegex.test(trimmed.replace(/\s+/g, ''))) {
      setSelectedCategory("Téléphone");
      return;
    }
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      setSelectedCategory("Liens web");
      return;
    }
    setSelectedCategory("Texte");
  };

  const handleImageFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAttachedImage(base64String);
        setSelectedCategory("Image");
        setInputValue(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // 📋 LECTURE DU PRESSE-PAPIERS
  useEffect(() => {
    const handleGlobalClickAutoPaste = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.prevent-autopaste') || target.closest('input') || target.closest('textarea')) {
        return; 
      }

      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          if (text.trim() && text !== inputValue) {
            setInputValue(text);
            autoDetectCategory(text);
          }
        }
      } catch (err) {
        console.log("Presse-papiers bloqué ou vide");
      }
    };

    window.addEventListener("click", handleGlobalClickAutoPaste);
    return () => window.removeEventListener("click", handleGlobalClickAutoPaste);
  }, [inputValue]);

  useEffect(() => {
    if (inputValue && selectedCategory !== "Image") {
      autoDetectCategory(inputValue);
    }
  }, [inputValue]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const clipboardItems = e.clipboardData?.items;
      if (!clipboardItems) return;
      for (let i = 0; i < clipboardItems.length; i++) {
        if (clipboardItems[i].type.indexOf("image") !== -1) {
          const file = clipboardItems[i].getAsFile();
          if (file) {
            handleImageFile(file);
            e.preventDefault();
          }
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && !attachedImage) return;

    let itemTitle: string | undefined = undefined;
    if (selectedCategory === "YouTube") {
      itemTitle = getYouTubeVideoTitle(inputValue);
    } else if (selectedCategory === "Image") {
      itemTitle = inputValue;
    } else if (selectedCategory === "Google Maps") {
      itemTitle = "Point d'intérêt Google Maps";
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    const newItem: PocketItem = {
      id: Date.now().toString(),
      category: selectedCategory,
      content: selectedCategory === "Image" && attachedImage ? attachedImage : inputValue,
      title: itemTitle,
      createdAt: `Aujourd'hui à ${timeString}`,
    };

    setItems([newItem, ...items]);
    setInputValue("");
    setAttachedImage(null);
    setSelectedCategory("Texte");
  };

  const toggleSidebarCategory = (cat: string) => {
    setOpenSidebarCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleEditTitle = (itemId: string, currentTitle?: string) => {
    const newAlias = prompt("Entrez un alias ou un titre personnalisé :", currentTitle || "");
    if (newAlias !== null) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, title: newAlias.trim() || undefined } : item
        )
      );
    }
  };

  const handleDelete = (itemId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    }
  };

  // 📋 FONCTION DE COPIE AU CLIC
  const handleCopyContent = async (e: React.MouseEvent, item: PocketItem) => {
    e.stopPropagation(); 
    if (item.category === "Image") return; 

    try {
      await navigator.clipboard.writeText(item.content);
      setToastMessage("Contenu copié dans le presse-papiers");
      
      setTimeout(() => {
        setToastMessage(null);
      }, 2500);
    } catch (err) {
      console.error("Erreur lors de la copie", err);
    }
  };

  const renderItemContent = (item: PocketItem) => {
    if (item.category === 'Image') {
      return (
        <div className="w-full flex justify-start items-center p-0 m-0 border-none outline-none">
          <img src={item.content} alt={item.title} className="max-h-32 rounded-lg object-contain border-0 border-none outline-none ring-0 p-0" />
        </div>
      );
    }
    if (item.category === 'Mail') {
      return <span className="text-indigo-600 hover:underline break-all font-medium">{item.content}</span>;
    }
    if (item.category === 'Téléphone') {
      return <span className="text-indigo-600 hover:underline break-all font-medium">{item.content}</span>;
    }
    if (item.category === 'YouTube' && item.title) {
      return (
        <div className="space-y-1">
          <p className="font-semibold text-slate-800 text-sm sm:text-base line-clamp-2">{item.title}</p>
          <span className="text-xs text-indigo-500 hover:underline break-all truncate block">
            {item.content}
          </span>
        </div>
      );
    }
    if (["Liens web", "Google Maps"].includes(item.category)) {
      return (
        <div className="space-y-0.5">
          {item.title && <p className="font-semibold text-slate-800 text-sm">{item.title}</p>}
          <span className="text-indigo-600 hover:underline break-all truncate block text-sm">{item.content}</span>
        </div>
      );
    }
    return <p className="whitespace-pre-wrap text-slate-700 line-clamp-3 text-sm leading-relaxed">{item.content}</p>;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex font-sans relative">
      
      {/* 📂 MENU LATÉRAL (SIDEBAR) */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col hidden md:flex shrink-0 z-10 shadow-sm">
        <div className="p-6 border-b border-slate-50 flex items-center justify-center">
          <img 
            src="/logo.png" 
            alt="PlopLink Logo" 
            className="h-12 w-auto object-contain drop-shadow-sm border-0 border-none outline-none"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.parentElement && !e.currentTarget.parentElement.querySelector('.fallback-title')) {
                e.currentTarget.parentElement.insertAdjacentHTML('beforeend', '<div class="fallback-title text-2xl font-bold text-indigo-700 flex items-center gap-2"><span>📥</span>PlopLink</div>');
              }
            }}
          />
        </div>

        {/* 🔍 INPUT DE RECHERCHE INTEGRÉ DANS LA SIDEBAR */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm pointer-events-none">🔍</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fos tiroirs..." 
              className="w-full pl-9 pr-8 py-2 bg-slate-50 text-slate-800 placeholder-slate-400 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
          <h3 className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-3 px-2">Mes Tiroirs</h3>
          
          <nav className="space-y-1.5">
            {categories.map((cat) => {
              // On compte et filtre sur displayedItems pour la mise à jour dynamique de la sidebar
              const filteredItems = displayedItems.filter((item) => item.category === cat);
              const isOpen = !!openSidebarCategories[cat];

              return (
                <div key={cat} className="rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSidebarCategory(cat);
                    }}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-slate-50 transition text-left rounded-lg group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg opacity-80 group-hover:opacity-100 transition-opacity">{categoryIcons[cat]}</span>
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{cat}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {filteredItems.length > 0 && (
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
                          {filteredItems.length}
                        </span>
                      )}
                      <span className="text-xs text-slate-300 group-hover:text-slate-500 transition-colors">{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="pl-9 pr-2 py-1 space-y-1.5 max-h-60 overflow-y-auto mb-2">
                      {filteredItems.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic py-1">Aucun résultat</p>
                      ) : (
                        filteredItems.map((item) => (
                          <div 
                            key={item.id} 
                            onClick={(e) => handleCopyContent(e, item)}
                            className="prevent-autopaste cursor-pointer group/item relative py-1.5 px-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 hover:shadow-sm transition"
                            title="Cliquez pour copier"
                          >
                            <div className="flex justify-between items-center mb-1 text-[9px] text-slate-400 font-medium">
                              <span>{item.createdAt}</span>
                              
                              <div className="flex items-center space-x-1">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditTitle(item.id, item.title);
                                  }}
                                  className="opacity-0 group-hover/item:opacity-100 text-slate-400 hover:text-indigo-600 transition"
                                  title="Modifier l'alias"
                                >
                                  ✏️
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(item.id);
                                  }}
                                  className="opacity-0 group-hover/item:opacity-100 text-slate-400 hover:text-red-500 transition"
                                  title="Supprimer"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                            
                            <div className="text-xs text-slate-600 line-clamp-1 pointer-events-none">
                              {renderItemContent(item)}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* 🎯 CONTENU PRINCIPAL */}
      <main className="flex-1 flex flex-col items-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-4xl space-y-10">
          
          <div className="text-center pt-4">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight flex items-center justify-center text-slate-900 drop-shadow-sm">
              Plop<span className="text-indigo-600 relative">Link<span className="absolute -right-3 bottom-2 md:bottom-3 w-2.5 h-2.5 md:w-3 md:h-3 bg-orange-500 rounded-full shadow-sm"></span></span>
            </h1>
            <p className="mt-4 text-lg text-slate-500 font-medium">Votre vide-poche intelligent pour capturer le web.</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 overflow-hidden transition-all focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-400">
              {attachedImage && (
                <div className="relative border-b border-slate-100 bg-slate-50 p-4 flex flex-col items-center border-none outline-none">
                  <div className="p-0 m-0 border-none outline-none flex items-center justify-center">
                    <img src={attachedImage} alt="Aperçu" className="max-h-48 rounded-lg object-contain shadow-sm border-0 border-none outline-none ring-0" />
                  </div>
                  <button 
                    type="button"
                    onClick={() => { setAttachedImage(null); setInputValue(""); setSelectedCategory("Texte"); }}
                    className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm text-white rounded-full px-3 py-1.5 text-xs font-semibold hover:bg-red-600 shadow-sm transition-colors border-none outline-none"
                  >
                    ✕ Retirer
                  </button>
                </div>
              )}

              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Glissez une image ou collez un contenu ici..."
                rows={3}
                className="w-full p-5 text-base md:text-lg text-slate-800 placeholder-slate-400 focus:outline-none resize-none bg-transparent border-none"
              />
              
              <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-xl shadow-sm text-sm font-semibold text-slate-700 transition active:scale-95"
                >
                  <span className="text-lg">{categoryIcons[selectedCategory]}</span>
                  <span className="tracking-wide">{selectedCategory}</span>
                  <span className="text-slate-400 text-[10px] ml-1">▼</span>
                </button>

                <button
                  type="submit"
                  onClick={(e) => e.stopPropagation()}
                  className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-indigo-200 active:scale-95 border-none outline-none"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>

          <div className="pt-4">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6 px-1 flex items-center space-x-2">
              <span>{searchQuery ? "Résultats de recherche" : "Flux récent"}</span>
              <span className="text-sm font-medium text-slate-400 bg-slate-200/50 px-2.5 py-0.5 rounded-full">{displayedItems.length}</span>
            </h2>
            
            {displayedItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 border-dashed p-12 flex flex-col items-center justify-center text-center">
                <span className="text-4xl mb-4 opacity-50">🔍</span>
                <p className="text-slate-500 font-medium">Aucun tiroir ne contient cet élément.</p>
                <p className="text-sm text-slate-400 mt-1">Essaye avec un autre mot-clé ou vide la recherche.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {displayedItems.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={(e) => handleCopyContent(e, item)}
                    title="Cliquez pour copier"
                    className="prevent-autopaste cursor-pointer bg-white p-5 rounded-2xl border border-slate-200/75 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col space-y-4 relative group/card"
                  >
                    
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover/card:opacity-100 transition-opacity border-none outline-none"
                      title="Supprimer"
                    >
                      ✕
                    </button>

                    <div className="flex items-center justify-between border-b border-slate-50 pb-3 pointer-events-none">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 ${
                        item.category === 'YouTube' ? 'bg-red-50 text-red-700' :
                        item.category === 'Image' ? 'bg-emerald-50 text-emerald-700' :
                        item.category === 'Liens web' ? 'bg-blue-50 text-blue-700' :
                        item.category === 'Mail' ? 'bg-purple-50 text-purple-700' :
                        item.category === 'Téléphone' ? 'bg-cyan-50 text-cyan-700' :
                        item.category === 'Google Maps' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        <span className="text-sm">{categoryIcons[item.category]}</span>
                        <span>{item.category}</span>
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 mr-6">{item.createdAt}</span>
                    </div>

                    <div className="flex-1 pointer-events-none border-none outline-none">
                      {renderItemContent(item)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODALE DE SÉLECTION */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Forcer une catégorie</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors border-none outline-none">
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(cat);
                    if (cat !== "Image") setAttachedImage(null);
                    setIsModalOpen(false);
                  }}
                  className={`flex items-center space-x-3 w-full p-3.5 rounded-xl border text-left transition ${
                    selectedCategory === cat
                      ? "border-indigo-500 bg-indigo-50/50 font-bold text-indigo-700 shadow-sm"
                      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-600 font-medium"
                  }`}
                >
                  <span className="text-2xl">{categoryIcons[cat]}</span>
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 🔔 TOAST DE NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center space-x-3 transition-all duration-300 border-none outline-none">
          <span className="text-xl">📋</span>
          <span className="text-sm font-semibold tracking-wide">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
