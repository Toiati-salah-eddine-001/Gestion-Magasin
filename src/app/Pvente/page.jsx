"use client";
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Barcode,
  Trash2,
  Plus,
  Minus,
  Printer,
  CreditCard,
  Wallet,
  BanknoteIcon,
} from "lucide-react";
// import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import BarcodeScanner from "@/Components/BarcodeScanner"; // Ensure this path is correct
import { settingsAPI } from "@/lib/api";

// Mock product data
const mockProducts = [
  { id: 1, name: "Ordinateur portable", price: 1200, barcode: "1234567890" },
  { id: 2, name: "Smartphone", price: 500, barcode: "0987654321" },
  { id: 3, name: "Écouteurs sans fil", price: 80, barcode: "5678901234" },
  { id: 4, name: "Chargeur portable", price: 25, barcode: "4321098765" },
  { id: 5, name: "Coque de téléphone", price: 15, barcode: "9876543210" },
];

export default function POS() {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  // const printContentRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [dataScaner, setdataScaner] = useState(null);
  const [storeInfo, setStoreInfo] = useState({});

  useEffect(() => {
    setIsClient(true);
    // Fetch store info
    settingsAPI.getAll('store').then((res) => {
      if (res && res.data && res.data.store) {
        setStoreInfo(res.data.store);
      }
    }).catch(() => {
      setStoreInfo({});
    });
  }, []);

  // useEffect(() => {
  //        // ______scanner code :
  //        const scanner = new Html5QrcodeScanner('reader',{
  //         fps: 5,
  //         qrbox: {
  //             width: 250,
  //             height: 250
  //         }
  //        });
  //     scanner.render(success,error);
  //     function success(result){
  //         scanner.clear();
  //         setdataScaner(result)
  //     }

  //     function error(result){
  //         console.warn(result)
  //     }

  // // ___________________________________
  // }, [])

  // ______________________
  // useEffect(() => {
  //   if (typeof window === 'undefined') return;

  //   const scanner = new Html5QrcodeScanner('reader', {
  //     fps: 5,
  //     qrbox: {
  //       width: 250,
  //       height: 250
  //     }
  //   });

  //   function success(result) {
  //     scanner.clear();
  //     setdataScaner(result);
  //     // Ajouter le produit scanné au panier
  //     // const product = mockProducts.find(p => p.barcode === result);
  //     // if (product) {
  //     //   const existingItem = cart.find(item => item.id === product.id);
  //     //   if (existingItem) {
  //     //     setCart(cart.map(item =>
  //     //       item.id === product.id
  //     //         ? { ...item, quantity: item.quantity + 1 }
  //     //         : item
  //     //     ));
  //     //   } else {
  //     //     setCart([...cart, { ...product, quantity: 1 }]);
  //     //   }
  //     // }
  //   }

  //   function error(err) {
  //     console.warn(err);
  //     // Ne pas effacer le scanner en cas d'erreur si vous voulez continuer à scanner
  //   }

  //   scanner.render(success, error);

  //   // Fonction de nettoyage pour éviter les fuites de mémoire
  //   return () => {
  //     scanner.clear().catch(error => {
  //       console.error("Échec de l'arrêt du scanner. ", error);
  //     });
  //   };
  // }, [isClient]); // Réexécuter uniquement lorsque isClient change
  // __________________________
  // useEffect(() => {
  //   if (!isClient) return;

  //   const scanner = new Html5QrcodeScanner('reader', {
  //     fps: 5,
  //     qrbox:
  //     { width: 250, height: 250 }
  //   });

  //   const success = (result) => {
  //     scanner.clear();
  //     setdataScaner(result);
  //     // Traiter le résultat ici
  //   };

  //   const error = (err) => {
  //     console.error('Erreur du scanner:', err);
  //   };

  //   scanner.render(success, error);

  //   return () => {
  //     scanner.clear().catch(error);
  //   };
  // }, [isClient]); // Dépend uniquement de isClient

  // useEffect(() => {
  //   // S'assurer qu'on est uniquement dans l'environnement client
  //   if (!isClient) return;

  //   let scanner;

  //   try {
  //     scanner = new Html5QrcodeScanner('reader', {
  //       fps: 5,
  //       qrbox: { width: 250, height: 250 }
  //     });

  //     const success = (result) => {
  //       // Arrêter le scanner avant de mettre à jour l'état
  //       scanner.clear().catch(console.error);

  //       // Mettre à jour l'état du résultat
  //       setdataScaner(result);

  //       // Ajouter le produit au panier
  //       const product = mockProducts.find(p => p.barcode === result);
  //       if (product) {
  //         setCart(prevCart => {
  //           const existingItem = prevCart.find(item => item.id === product.id);
  //           return existingItem
  //             ? prevCart.map(item =>
  //                 item.id === product.id
  //                   ? {...item, quantity: item.quantity + 1}
  //                   : item
  //               )
  //             : [...prevCart, {...product, quantity: 1}];
  //         });
  //       }
  //     };

  //     const error = (err) => {
  //       console.warn('Erreur du scanner:', err);
  //     };

  //     scanner.render(success, error);
  //   } catch (err) {
  //     console.error('Échec de l\'initialisation du scanner:', err);
  //   }

  //   // Fonction de nettoyage
  //   return () => {
  //     if (scanner) {
  //       scanner.clear().catch(err => {
  //         console.error('Échec de l\'arrêt du scanner:', err);
  //       });
  //     }
  //   };
  // }, []); // Tableau de dépendances vide car nous voulons l'exécuter une seule fois

  // ____________________clode :
  useEffect(() => {
    // Only run this on the client-side
    if (!isClient) return;

    // Create a reference to store the scanner instance
    let scanner = null;

    // Wait a moment to ensure the DOM element exists
    const initializeScanner = setTimeout(() => {
      try {
        // Check if the element exists
        const readerElement = document.getElementById("reader");
        if (!readerElement) {
          console.error("Élément lecteur non trouvé dans le DOM");
          return;
        }

        // Create scanner with appropriate configuration
        scanner = new Html5QrcodeScanner(
          "reader",
          {
            fps: 5,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
          },
          /* verbose= */ false
        );

        const onScanSuccess = (decodedText) => {
          // Pause scanning after success
          scanner.pause();

          // Update state with scanned value and trigger search
          setSearchQuery(decodedText);
          setTimeout(() => {
            handleSearch(decodedText);
          }, 0);
        };

        const onScanFailure = (error) => {
          // Don't log errors on every frame, as it's too noisy
          // Only log critical issues
          if (error && error.name === "NotAllowedError") {
            console.error("Permission de la caméra refusée:", error);
          }
        };

        // Start the scanner
        scanner.render(onScanSuccess, onScanFailure);
      } catch (err) {
        console.error("Échec de l'initialisation du scanner:", err);
      }
    }, 500); // Small delay to ensure DOM is ready

    // Cleanup function
    return () => {
      clearTimeout(initializeScanner);

      // Properly clear the scanner on unmount
      if (scanner) {
        try {
          scanner.clear();
        } catch (err) {
          console.error("Échec de la réinitialisation du scanner:", err);
        }
      }
    };
  }, [isClient]); // Only depend on isClient

  // Add this function to resume scanning after a successful scan
  const resetScanner = () => {
    setdataScaner(null);

    // Try to resume the scanner
    setTimeout(() => {
      try {
        const scanner = new Html5QrcodeScanner(
          "reader",
          {
            fps: 5,
            qrbox: { width: 250, height: 250 },
          },
          false
        );

        scanner.render(
          (result) => {
            scanner.pause();
            setdataScaner(result);

            // Add product to cart if it exists
            const product = mockProducts.find((p) => p.barcode === result);
            if (product) {
              setCart((prevCart) => {
                const existingItem = prevCart.find(
                  (item) => item.id === product.id
                );
                if (existingItem) {
                  return prevCart.map((item) =>
                    item.id === product.id
                      ? { ...item, quantity: item.quantity + 1 }
                      : item
                  );
                } else {
                  return [...prevCart, { ...product, quantity: 1 }];
                }
              });
            }
          },
          (error) => console.warn(error)
        );
      } catch (err) {
        console.error("Échec de la réinitialisation du scanner:", err);
      }
    }, 500);
  };
  // __________________________________

  const form = useForm();

  // ___________ fct() printe.
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,

    onBeforeGetContent: () => {
      setIsPrinting(true);
    },

    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });
  // ________________________________

  const handleSearch = (query) => {
    const searchValue = query !== undefined ? query : searchQuery;
    const product = mockProducts.find(
      (p) =>
        p.barcode === searchValue ||
        p.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    if (product) {
      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setCart([...cart, { ...product, quantity: 1 }]);
      }

      setSearchQuery("");
    }
  };

  const handleIncreaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;

  const handleCompleteSale = async () => {
    try {
      setLoading(true);
      const saleData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price
        })),
        payment_method: paymentMethod,
        discount_percent: discountPercent,
        total: total
      };

      await salesApi.createSale(saleData);
      
      console.log("Sale completed successfully");

      // Reset cart and fetch updated stats
      setCart([]);
      setDiscountPercent(0);
      setPaymentMethod('cash');
      fetchDailyStats();

      // Handle printing
      setIsPrinting(true);
      setTimeout(() => {
        setIsPrinting(false);
      }, 1000);

    } catch (error) {
      console.error('Error completing sale:', error);
      console.error("Failed to complete sale");
    } finally {
      setLoading(false);
    }
  };

  // _________Add meta heade !!
  // _______________________ ADD Forme feild for back end !!!!
  // ________________________also add code Facture .
  if (!isClient) {
    return <div>جاري تحميل الماسح...</div>;
  }
  console.log("dataScaner:", dataScaner);

  return (
    <MainLayout>
      {/* <time dateTime="2016-10-25" suppresshydrationwarning="" /> */}
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">نقطة البيع</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Product Search */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                بحث عن المنتجات
              </CardTitle>
              <Barcode className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4 flex-row-reverse">
                <Button onClick={() => handleSearch(searchQuery)}>بحث</Button>
                <Input
                  className="flex-1"
                  placeholder="ادخل اسم المنتج أو الباركود"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-right border-b">
                      <th className="py-2 px-4 font-medium">Produit</th>
                      <th className="py-2 px-4 font-medium">Prix</th>
                      <th className="py-2 px-4 font-medium">Quantité</th>
                      <th className="py-2 px-4 font-medium">Total</th>
                      <th className="py-2 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-4 text-center text-muted-foreground"
                        >
                          Aucun produit dans le panier
                        </td>
                      </tr>
                    ) : (
                      cart.map((item) => (
                        <tr key={item.id} className="border-b text-right">
                          <td className="py-2 px-4">{item.name}</td>
                          <td className="py-2 px-4">
                            {item.price.toFixed(2)} €
                          </td>
                          <td className="py-2 px-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDecreaseQuantity(item.id)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span>{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleIncreaseQuantity(item.id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                          <td className="py-2 px-4">
                            {(item.price * item.quantity).toFixed(2)} €
                          </td>
                          <td className="py-2 px-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Checkout */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Facture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total :</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Remise (%):</span>
                  <Input
                    type="number"
                    className="w-24"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  />
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold">Total :</span>
                  <span className="font-bold">{total.toFixed(2)} €</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Mode de paiement</h3>
                <div className="flex space-x-2">
                  <Button
                    variant={paymentMethod === "cash" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("cash")}
                    className="flex-1"
                  >
                    <BanknoteIcon className="h-4 w-4 mr-2" />
                    Espèces
                  </Button>
                  <Button
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("card")}
                    className="flex-1"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Carte
                  </Button>
                  <Button
                    variant={
                      paymentMethod === "transfer" ? "default" : "outline"
                    }
                    onClick={() => setPaymentMethod("transfer")}
                    className="flex-1"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Virement
                  </Button>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Button
                  className="w-full"
                  size="lg"
                  disabled={cart.length === 0}
                  onClick={handleCompleteSale}
                >
                  Confirmer la vente
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={cart.length === 0}
                  onClick={() => reactToPrintFn()}
                  // onClick={()=>console.log(PrintCentent.current)}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  {isPrinting ? "Impression en cours..." : "Imprimer facture"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* {!dataScaner && <div id="reader" style={{ width: "500px", height: "400px", backgroundColor: "#eee" }}></div>}
          {dataScaner && <> <p>تم مسح: {dataScaner}</p> <Button onClick={() => setdataScaner(null)}>
                Scanner un autre produit
          </Button></>} */}
      {/* <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Lecteur de code-barres</h2>
              <div id="reader" className="border p-4 rounded bg-white shadow-md" />
              {dataScaner && (
                <p className="mt-2 text-sm text-green-600">
                  Code-barres lu: <strong>{dataScaner}</strong>
                </p>
              )}
            </div> */}
      {/* __________________Scanne  Code Part ____________________ */}




      {/* <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Lecteur de code-barres</h2>
        <div id="reader" className="border p-4 rounded bg-white shadow-md" />
        {dataScaner && (
          <div className="mt-2">
            <p className="text-sm text-green-600">
              Code-barres lu: <strong>{dataScaner}</strong>
            </p>
            <Button onClick={resetScanner} variant="outline" className="mt-2">
              Scanner un autre produit
            </Button>
          </div>
        )}
      </div> */}
          <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Lecteur de code-barres</h2>
        <BarcodeScanner
          onScanSuccess={(decodedText) => {
          // Pause scanning after success
          scanner.pause();

          // Update state with scanned value
          setdataScaner(decodedText);

          // Add product to cart if it exists
          const product = mockProducts.find((p) => p.barcode === decodedText);
          if (product) {
            setCart((prevCart) => {
              const existingItem = prevCart.find(
                (item) => item.id === product.id
              );
              if (existingItem) {
                return prevCart.map((item) =>
                  item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                );
              } else {
                return [...prevCart, { ...product, quantity: 1 }];
              }
            });
          }
        }}


          onScanFailure={(error) => {
          // Don't log errors on every frame, as it's too noisy
          // Only log critical issues
          if (error && error.name === "NotAllowedError") {
            console.error("Permission de la caméra refusée:", error);
          }
        }}
        />
        {dataScaner && (
          <div className="mt-2">
            <p className="text-sm text-green-600">
              Code-barres lu: <strong>{dataScaner}</strong>
            </p>
            <Button onClick={resetScanner} variant="outline" className="mt-2">
              Scanner un autre produit
            </Button>
          </div>
        )}
      </div>





      {/* ____________________________________________           */}
      {/* _______________content Facture  */}
      <div
        style={{
          position: "fixed",
          left: "-10000px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <div ref={contentRef} className="p-6">
          {/* Store info at the top of the invoice */}
          <div className="text-center mb-2">
            <div className="font-bold text-lg">{storeInfo.store_name || "Nom du magasin"}</div>
            <div>{storeInfo.store_address}</div>
            <div>{storeInfo.store_phone}</div>
            <div>{storeInfo.store_email}</div>
          </div>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Facture de vente</h1>
            <p className="text-muted-foreground">
              Date: {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>

          <div className="mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b text-right">
                  <th className="py-2 px-4">Produit</th>
                  <th className="py-2 px-4">Prix</th>
                  <th className="py-2 px-4">Quantité</th>
                  <th className="py-2 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-b text-right">
                    <td className="py-2 px-4">{item.name}</td>
                    <td className="py-2 px-4">{item.price.toFixed(2)} €</td>
                    <td className="py-2 px-4">{item.quantity}</td>
                    <td className="py-2 px-4">
                      {(item.price * item.quantity).toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Sous-total :</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span>Remise:</span>
              <span>
                {discountAmount.toFixed(2)} ر.س ({discountPercent}%)
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total final :</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
            <p>Merci de votre confiance</p>
            <p>Pour toute question: 0123456789</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
