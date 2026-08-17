"use client";

import { useEffect, useRef, useState, type FormEvent, type MouseEvent as ReactMouseEvent } from "react";
import type { Category, PocketItem } from "@/app/types";
import { autoDetectCategory, getYouTubeVideoTitle } from "@/app/lib/categoryDetection";
import { useLocalItems } from "@/app/hooks/useLocalItems";
import Sidebar from "@/app/components/Sidebar";
import ComposerForm from "@/app/components/ComposerForm";
import CategoryModal from "@/app/components/CategoryModal";
import ShareModal from "@/app/components/ShareModal";
import Toast from "@/app/components/Toast";
import ItemCard from "@/app/components/ItemCard";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("Texte");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openSidebarCategories, setOpenSidebarCategories] = useState<Record<string, boolean>>({});
  const [items, setItems] = useLocalItems();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const displayedItems = items.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      item.content.toLowerCase().includes(query) ||
      (item.title?.toLowerCase().includes(query) ?? false) ||
      item.category.toLowerCase().includes(query)
    );
  });

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedImage(reader.result as string);
      setSelectedCategory("Image");
      setInputValue(file.name);
    };
    reader.readAsDataURL(file);
  };

  // 🧩 Pré-remplissage depuis l'extension Chrome (lien du type /?add=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const addParam = params.get("add");
    if (addParam) {
      setInputValue(addParam);
      setSelectedCategory(autoDetectCategory(addParam));
      window.history.replaceState({}, "", window.location.pathname);
      textareaRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 📋 Auto-collage : un clic hors des champs de saisie relit le presse-papiers
  useEffect(() => {
    const handleGlobalClickAutoPaste = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".prevent-autopaste") || target.closest("input") || target.closest("textarea")) {
        return;
      }
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          if (text.trim() && text !== inputValue) {
            setInputValue(text);
            setSelectedCategory(autoDetectCategory(text));
          }
        }
      } catch {
        console.log("Presse-papiers bloqué ou vide");
      }
    };

    window.addEventListener("click", handleGlobalClickAutoPaste);
    return () => window.removeEventListener("click", handleGlobalClickAutoPaste);
  }, [inputValue]);

  // Re-détecte la catégorie à chaque frappe (sauf si une image est attachée)
  useEffect(() => {
    if (inputValue && selectedCategory !== "Image") {
      setSelectedCategory(autoDetectCategory(inputValue));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  // Colle une image depuis le presse-papiers (Ctrl+V)
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

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && !attachedImage) return;

    let itemTitle: string | undefined;
    if (selectedCategory === "YouTube") {
      itemTitle = getYouTubeVideoTitle(inputValue);
    } else if (selectedCategory === "Image") {
      itemTitle = inputValue;
    } else if (selectedCategory === "Google Maps") {
      itemTitle = "Point d'intérêt Google Maps";
    }

    const timeString = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

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

  const handleEditTitle = (itemId: string, currentTitle?: string) => {
    const newAlias = prompt("Entrez un alias ou un titre personnalisé :", currentTitle || "");
    if (newAlias === null) return;
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, title: newAlias.trim() || undefined } : item))
    );
  };

  const handleDelete = (itemId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  const handleCopyContent = async (e: ReactMouseEvent, item: PocketItem) => {
    e.stopPropagation();
    if (item.category === "Image") return;
    try {
      await navigator.clipboard.writeText(item.content);
      setToastMessage("Contenu copié dans le presse-papiers");
      setTimeout(() => setToastMessage(null), 2500);
    } catch (err) {
      console.error("Erreur lors de la copie", err);
    }
  };

  const toggleSidebarCategory = (cat: string) => {
    setOpenSidebarCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex font-sans relative">
      <Sidebar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        displayedItems={displayedItems}
        openSidebarCategories={openSidebarCategories}
        onToggleCategory={toggleSidebarCategory}
        onCopy={handleCopyContent}
        onEditTitle={handleEditTitle}
        onDelete={handleDelete}
        onOpenShare={() => setIsShareModalOpen(true)}
      />

      <main className="flex-1 flex flex-col items-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-4xl space-y-10">
          <div className="text-center pt-4">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight flex items-center justify-center text-slate-900 drop-shadow-sm">
              Plop
              <span className="text-indigo-600 relative">
                Link
                <span className="absolute -right-3 bottom-2 md:bottom-3 w-2.5 h-2.5 md:w-3 md:h-3 bg-orange-500 rounded-full shadow-sm"></span>
              </span>
            </h1>
            <p className="mt-4 text-lg text-slate-500 font-medium">Votre vide-poche intelligent pour capturer le web.</p>
          </div>

          <ComposerForm
            inputValue={inputValue}
            onInputChange={setInputValue}
            attachedImage={attachedImage}
            onRemoveImage={() => {
              setAttachedImage(null);
              setInputValue("");
              setSelectedCategory("Texte");
            }}
            selectedCategory={selectedCategory}
            onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
            onSubmit={handleSave}
            textareaRef={textareaRef}
          />

          <div className="pt-4">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6 px-1 flex items-center space-x-2">
              <span>{searchQuery ? "Résultats de recherche" : "Flux récent"}</span>
              <span className="text-sm font-medium text-slate-400 bg-slate-200/50 px-2.5 py-0.5 rounded-full">
                {displayedItems.length}
              </span>
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
                  <ItemCard key={item.id} item={item} onCopy={handleCopyContent} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {isCategoryModalOpen && (
        <CategoryModal
          selectedCategory={selectedCategory}
          onSelect={(cat) => {
            setSelectedCategory(cat);
            if (cat !== "Image") setAttachedImage(null);
            setIsCategoryModalOpen(false);
          }}
          onClose={() => setIsCategoryModalOpen(false)}
        />
      )}

      {isShareModalOpen && <ShareModal items={items} onClose={() => setIsShareModalOpen(false)} />}

      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}
