import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Phone, Send, Globe, Link, Trash2, Search } from "lucide-react";
import { motion } from "framer-motion";

const translations = {
  ru: {
    welcome: "Добро пожаловать в HameshaSabz",
    description: "Ваш проводник к лучшим товарам из Китая (1688.com)",
    cart: "Корзина",
    order: "Заказать через Telegram",
    contact: "Связь",
    rights: "Все права защищены",
    addProduct: "Добавить товар по ссылке",
    placeholder: "Вставьте ссылку с 1688.com",
    search: "Поиск"
  },
  tj: {
    welcome: "Хуш омадед ба HameshaSabz",
    description: "Роҳнамои шумо ба маҳсулоти беҳтарин аз Чин (1688.com)",
    cart: "Сабад",
    order: "Фармоиш тавассути Telegram",
    contact: "Тамос",
    rights: "Ҳама ҳуқуқҳо ҳифз шудаанд",
    addProduct: "Илова кардани маҳсулот бо пайванд",
    placeholder: "Садо диҳед пайванд аз 1688.com",
    search: "Ҷустуҷӯ"
  },
  en: {
    welcome: "Welcome to HameshaSabz",
    description: "Your gateway to the best products from China (1688.com)",
    cart: "Cart",
    order: "Order via Telegram",
    contact: "Contact",
    rights: "All rights reserved",
    addProduct: "Add product by link",
    placeholder: "Paste 1688.com link here",
    search: "Search"
  },
  cn: {
    welcome: "欢迎来到 HameshaSabz",
    description: "您通往中国最佳商品的门户 (1688.com)",
    cart: "购物车",
    order: "通过Telegram订购",
    contact: "联系方式",
    rights: "版权所有",
    addProduct: "通过链接添加商品",
    placeholder: "在此粘贴1688.com链接",
    search: "搜索"
  }
};

async function fetchMetadataFromLink(link) {
  try {
    const response = await fetch(`/api/scrape?url=${encodeURIComponent(link)}`);
    const data = await response.json();
    return {
      title: data.title || "Product",
      image: data.image || `https://via.placeholder.com/300x200?text=Product`,
      url: link
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Product",
      image: `https://via.placeholder.com/300x200?text=Product`,
      url: link
    };
  }
}

export default function HomePage() {
  const [lang, setLang] = useState("ru");
  const [productLinks, setProductLinks] = useState([]);
  const [inputLink, setInputLink] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const t = translations[lang];

  useEffect(() => {
    const savedProducts = localStorage.getItem("hamesha_products");
    if (savedProducts) {
      setProductLinks(JSON.parse(savedProducts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("hamesha_products", JSON.stringify(productLinks));
  }, [productLinks]);

  const handleAddProduct = async () => {
    if (inputLink) {
      const product = await fetchMetadataFromLink(inputLink);
      setProductLinks([...productLinks, product]);
      setInputLink("");
    }
  };

  const handleDeleteProduct = (index) => {
    const updated = [...productLinks];
    updated.splice(index, 1);
    setProductLinks(updated);
  };

  const filteredProducts = productLinks.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <header className="flex justify-between items-center p-4 bg-green-700 text-white rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold">HameshaSabz.tj</h1>
        <div className="flex items-center gap-3">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-green-800 rounded-xl px-2 py-1"
          >
            <option value="ru">RU</option>
            <option value="tj">TJ</option>
            <option value="en">EN</option>
            <option value="cn">CN</option>
          </select>
          <ShoppingCart className="w-6 h-6" />
          <Button className="bg-white text-green-700 hover:bg-green-100">{t.cart}</Button>
        </div>
      </header>

      <section className="my-6 text-center">
        <h2 className="text-3xl font-semibold text-green-800 mb-2">{t.welcome}</h2>
        <p className="text-green-700">{t.description}</p>
      </section>

      <section className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
        <Input
          type="text"
          placeholder={t.placeholder}
          value={inputLink}
          onChange={(e) => setInputLink(e.target.value)}
          className="w-full md:w-1/2"
        />
        <Button onClick={handleAddProduct} className="bg-green-700 text-white hover:bg-green-800">
          <Link className="mr-2 w-4 h-4" /> {t.addProduct}
        </Button>
      </section>

      <section className="flex justify-center mb-6">
        <div className="flex items-center gap-2 w-full md:w-1/3">
          <Search className="w-5 h-5 text-green-600" />
          <Input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredProducts.map((product, index) => (
          <motion.div whileHover={{ scale: 1.05 }} key={index}>
            <Card className="rounded-2xl shadow-md">
              <CardContent className="p-4">
                <img
                  src={product.image}
                  alt={`Product ${index + 1}`}
                  className="rounded-xl mb-2"
                />
                <h3 className="text-lg font-semibold text-green-800">{product.title}</h3>
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 underline block mb-2"
                >
                  {product.url}
                </a>
                <div className="flex justify-between items-center">
                  <a
                    href="https://t.me/+992930091112"
                    className="inline-flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl"
                  >
                    <Send className="w-4 h-4" /> {t.order}
                  </a>
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteProduct(index)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      <footer className="mt-8 p-4 text-center text-green-600">
        <p>{t.contact}: <Phone className="inline w-4 h-4" /> +992930091112</p>
        <p>© 2025 HameshaSabz.tj — {t.rights}</p>
      </footer>
    </div>
  );
}