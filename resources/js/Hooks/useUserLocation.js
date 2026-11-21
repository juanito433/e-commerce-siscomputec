import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "siscomputec_user_location";

function isWithinCancun(city = "", state = "", postalCode = "") {
    const normalizedCity = city
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    const normalizedState = state
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    const cleanCp = String(postalCode || "").trim();

    const matchesCancunName =
        normalizedCity.includes("cancun") ||
        normalizedCity.includes("benito juarez") ||
        normalizedCity.includes("alfredo v. bonfil");

    const matchesCancunCp =
        normalizedState.includes("quintana roo") && /^775\d{2}$/.test(cleanCp);

    return matchesCancunName || matchesCancunCp;
}

export function useUserLocation() {
    const inFlightRef = useRef(false);

    const [locationData, setLocationData] = useState(() => {
        if (typeof window === "undefined") {
            return {
                status: "idle",
                city: "Cancún",
                postalCode: "77500",
                inCancun: true,
            };
        }

        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch {
            // Ignora errores de sessionStorage
        }

        return {
            status: "idle",
            city: "Cancún",
            postalCode: "77500",
            inCancun: true,
        };
    });

    const persist = useCallback((nextState) => {
        setLocationData(nextState);
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
        } catch {
            // Ignora errores de sessionStorage
        }
    }, []);

    const requestLocation = useCallback(
        (forceFresh = true) => {
            if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
                persist({
                    status: "error",
                    city: "Ubicación no disponible",
                    postalCode: "—",
                    inCancun: false,
                });
                return;
            }

            if (inFlightRef.current) return;
            inFlightRef.current = true;

            setLocationData((prev) => ({ ...prev, status: "loading" }));

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const controller = new AbortController();
                    const fetchTimeout = setTimeout(() => controller.abort(), 6000);

                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=es`,
                            { signal: controller.signal }
                        );

                        if (!response.ok) {
                            throw new Error("Geocoding HTTP error");
                        }

                        const data = await response.json();
                        const addr = data?.address || {};

                        const detectedCity =
                            addr.city ||
                            addr.town ||
                            addr.municipality ||
                            addr.county ||
                            addr.state ||
                            "Ubicación detectada";
                        const detectedState = addr.state || "";
                        const detectedCp = addr.postcode || "S/CP";
                        const inCancun = isWithinCancun(
                            detectedCity,
                            detectedState,
                            detectedCp
                        );

                        persist({
                            status: "granted",
                            city: detectedCity,
                            postalCode: detectedCp,
                            inCancun,
                        });
                    } catch {
                        // Si Nominatim tarda o bloquea por ráfaga, al menos marcamos coordenada obtenida
                        persist({
                            status: "granted",
                            city: "Cancún (GPS)",
                            postalCode: "77500",
                            inCancun: true,
                        });
                    } finally {
                        clearTimeout(fetchTimeout);
                        inFlightRef.current = false;
                    }
                },
                (err) => {
                    inFlightRef.current = false;
                    persist({
                        status: err?.code === 1 ? "denied" : "error",
                        city:
                            err?.code === 1
                                ? "Ubicación desactivada"
                                : "No se pudo obtener GPS",
                        postalCode: "—",
                        inCancun: false,
                    });
                },
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: forceFresh ? 0 : 300000,
                }
            );
        },
        [persist]
    );

    useEffect(() => {
        if (locationData.status === "idle") {
            requestLocation(false);
        }
    }, [locationData.status, requestLocation]);

    return {
        ...locationData,
        requestLocation: () => requestLocation(true),
    };
}
