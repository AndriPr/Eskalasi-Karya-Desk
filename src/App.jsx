import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
        opacity: 1, 
        y: 0, 
        transition: { 
            type: "spring", 
            stiffness: 300, 
            damping: 24 
        } 
    }
};

function TypewriterText({ text }) {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        let i = 0;
        let isDeleting = false;
        let timeoutId;
        
        const type = () => {
            const currentText = isDeleting 
                ? text.substring(0, i - 1)
                : text.substring(0, i + 1);

            setDisplayText(currentText);

            if (!isDeleting) {
                i++;
                if (i === text.length) {
                    isDeleting = true;
                    timeoutId = setTimeout(type, 3000); // Wait 3 seconds before deleting
                    return;
                }
            } else {
                i--;
                if (i === 0) {
                    isDeleting = false;
                    timeoutId = setTimeout(type, 1000); // Wait 1 second before re-typing
                    return;
                }
            }

            const speed = isDeleting ? 50 : 120; // Deletes faster than types
            timeoutId = setTimeout(type, speed);
        };
        
        timeoutId = setTimeout(type, 1000); // Initial delay
        return () => clearTimeout(timeoutId);
    }, [text]);

    return (
        <motion.span 
            className="inline-flex items-center text-primary cursor-pointer font-bold italic"
            whileHover={{
                x: [0, -3, 3, -3, 3, 0],
                textShadow: [
                    "2px 0px 0px rgba(255,0,0,0.5), -2px 0px 0px rgba(0,0,255,0.5)",
                    "-2px 0px 0px rgba(255,0,0,0.5), 2px 0px 0px rgba(0,0,255,0.5)",
                    "0px 0px 0px rgba(0,0,0,0)"
                ],
                transition: { duration: 0.3 }
            }}
        >
            {displayText}
            <motion.span 
                animate={{ opacity: [1, 0, 1] }} 
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="inline-block w-[3px] md:w-[4px] h-[35px] md:h-[45px] bg-primary ml-1 rounded-sm align-middle"
            />
        </motion.span>
    );
}

function GlassCard({ href, icon, title, description, onClick, style }) {
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty('--mouse-x', `${x}px`);
        cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    const handleClick = (e) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <motion.a 
            variants={itemVariants}
            style={style}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            href={href} 
            className="glass-card p-8 rounded-[2rem] flex flex-col items-center text-center group cursor-pointer relative z-10"
        >
            <div className="w-16 h-16 mb-5 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-500 shadow-lg shadow-primary/5">
                <span className="material-symbols-outlined !text-[40px]">{icon}</span>
            </div>
            <h3 className="font-headline-lg text-lg text-on-surface mb-2">{title}</h3>
            <p className="text-sm text-on-surface-variant">{description}</p>
        </motion.a>
    );
}

function DynamicGreeting() {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours();
            if (hour >= 0 && hour < 12) setGreeting('Selamat Pagi,');
            else if (hour >= 12 && hour < 15) setGreeting('Selamat Siang,');
            else if (hour >= 15 && hour < 19) setGreeting('Selamat Sore,');
            else setGreeting('Selamat Malam,');
        };
        updateGreeting();
        const intervalId = setInterval(updateGreeting, 60000);
        return () => clearInterval(intervalId);
    }, []);

    return <span>{greeting}</span>;
}

function RealTimeClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    return (
        <span className="font-mono font-medium text-sm text-on-surface-variant bg-surface/50 px-3 py-1 rounded-full border border-white/5">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
    );
}

function LofiWidget() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio("https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3");
            audioRef.current.loop = true;
            audioRef.current.volume = 0.5;
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", delay: 1 }}
            className="fixed bottom-24 md:bottom-28 right-5 z-50 flex items-center gap-3 bg-surface-container-high/80 backdrop-blur-xl p-2.5 rounded-full border border-white/10 shadow-2xl"
        >
            <div className="flex gap-1 h-5 mx-2 items-center">
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        animate={isPlaying ? { height: ["20%", "100%", "40%", "80%", "20%"] } : { height: "20%" }}
                        transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                        className="w-1.5 bg-primary rounded-full"
                    />
                ))}
            </div>
            <button 
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary/20"
            >
                <span className="material-symbols-outlined">{isPlaying ? 'pause' : 'play_arrow'}</span>
            </button>
        </motion.div>
    );
}

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

    return (
        <div className="font-body-lg text-on-surface overflow-x-hidden pb-32 min-h-screen relative">
            {/* Top Scroll Blur Mask */}
            <div className="fixed top-0 left-0 right-0 h-28 z-30 pointer-events-none backdrop-blur-[20px]" style={{ maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)' }}></div>
            
            {/* Bottom Scroll Blur Mask */}
            <div className="fixed bottom-0 left-0 right-0 h-40 z-30 pointer-events-none backdrop-blur-[20px]" style={{ maskImage: 'linear-gradient(to top, black 20%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 20%, transparent 100%)' }}></div>

            {/* Fluid Background Layer */}
            <motion.div 
                className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
            >
                <motion.div 
                    animate={{ 
                        x: [0, 100, -50, 0],
                        y: [0, -50, 100, 0],
                        scale: [1, 1.2, 0.8, 1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"
                />
                <motion.div 
                    animate={{ 
                        x: [0, -100, 50, 0],
                        y: [0, 100, -50, 0],
                        scale: [1, 0.8, 1.2, 1]
                    }}
                    transition={{ duration: 18, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"
                />
            </motion.div>

            {/* Top AppBar */}
            <motion.header 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
                className="fixed top-5 left-5 right-5 z-40 h-16 max-w-screen-xl mx-auto flex justify-between items-center px-4 rounded-full bg-surface-container/60 backdrop-blur-3xl border border-white/10 shadow-2xl transition-all duration-300"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden p-1">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXhK4o8GvDNDdaPSxp40vzjnfn32uVO5sVDcUje0aLY-sTT8YDda1riFpXgPtnviirRGeHm6bOB0Lf9_drL1HI1xDdBmPkjLTPbHlJthd1nFtxg47D789x-9LetvOR9DQB4ZplRfowmn_0tMtQyytnLx53E-3n_e2dJ6f6Ni-3STWQ86nSoDHcs5aPWub_MG_HI3XOwFRYOlmwayRXP4pmUAb8ep6WAGiXhIwTbD5VIgmghiPoll4MeFZepmigU5Mp5PBWIyB7dF8P" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="font-headline-lg-mobile text-xl md:text-2xl font-bold text-on-surface tracking-tight">Eskalasi Desk</h1>
                </div>
                <RealTimeClock />
            </motion.header>

            {/* Main Content */}
            <motion.main 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="pt-32 px-5 md:px-10 max-w-screen-xl mx-auto space-y-section-gap relative z-10"
            >
                {/* Hero Section */}
                <motion.section 
                    variants={itemVariants}
                    style={{ opacity: heroOpacity, scale: heroScale }}
                    className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest min-h-[260px] flex flex-col justify-center border border-primary/10 shadow-2xl origin-top"
                >
                    <div className="relative z-10 space-y-4">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary font-label-sm uppercase tracking-wider border border-primary/20">KABINET ESKALASI KARYA</span>
                        <h2 className="font-display-lg text-3xl md:text-4xl text-on-surface tracking-tight leading-tight flex flex-wrap items-center gap-x-2"><DynamicGreeting /> <TypewriterText text="Para Karya!" /></h2>
                        <p className="text-on-surface-variant font-body-lg max-w-xl leading-relaxed">Pusat Layanan & Informasi Kabinet Eskalasi Karya. Temukan semua tautan penting, format surat, dan jadwal kegiatan himpunan di sini.</p>
                    </div>
                </motion.section>

                {/* Grid Service Cards */}
                <motion.section 
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <GlassCard 
                        href="#" 
                        icon="folder_open" 
                        title="Format Surat" 
                        description="Akses template dokumen resmi organisasi."
                        onClick={() => setIsModalOpen(true)}
                    />
                    <GlassCard 
                        href="https://drive.google.com/file/d/1agGRtc_KfY65_7gw2im5MPhkAgsk8ydw/view?usp=sharing" 
                        icon="account_tree" 
                        title="Alur Pengajuan" 
                        description="Panduan langkah demi langkah administrasi." 
                    />
                    <GlassCard 
                        href="#" 
                        icon="calendar_today" 
                        title="Kalender" 
                        description="Jadwal kegiatan dan deadline penting." 
                        onClick={() => setIsCalendarModalOpen(true)}
                    />
                    <GlassCard 
                        href="https://drive.google.com/file/d/1JN__a8Vody2GARejUwdY0wwkBYiHieoH/view?usp=sharing" 
                        icon="menu_book" 
                        title="Blueprint" 
                        description="Visi, misi, dan struktur operasional." 
                    />
                </motion.section>

                {/* Secondary Info */}
                <motion.section 
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="max-w-2xl mx-auto w-full pb-8"
                >
                    <div 
                        className="glass-card rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center space-y-4 border-error/10 relative z-10"
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                            e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                        }}
                    >
                        <motion.div 
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="w-14 h-14 bg-error/10 text-error rounded-full flex items-center justify-center shadow-lg shadow-error/5"
                        >
                            <span className="material-symbols-outlined text-3xl">emergency</span>
                        </motion.div>
                        <h4 className="font-headline-lg text-xl">Butuh Bantuan?</h4>
                        <p className="text-body-md text-on-surface-variant">Hubungi sekretariat melalui tombol bantuan di bawah jika menemui kendala administratif.</p>
                        <motion.a 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="https://wa.me/6289601465254" target="_blank" rel="noopener noreferrer" 
                            className="w-full max-w-xs bg-primary text-on-primary px-8 py-3.5 rounded-full font-label-md hover:brightness-110 transition-all shadow-lg shadow-primary/20 inline-flex justify-center items-center"
                        >
                            HUBUNGI ADMIN
                        </motion.a>
                    </div>
                </motion.section>
            </motion.main>

            {/* Bottom NavBar */}
            <motion.nav 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
                className="fixed bottom-8 left-6 right-6 max-w-screen-md mx-auto h-20 rounded-full bg-surface-container/80 backdrop-blur-3xl z-40 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex justify-around items-center px-4"
            >
                <a className="flex flex-col items-center justify-center bg-primary/20 text-primary rounded-2xl w-14 h-14 transition-colors group" href="#">
                    <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="material-symbols-outlined">home_app_logo</motion.span>
                    <span className="font-label-sm text-[10px] mt-1">Layanan</span>
                </a>
                <a className="flex flex-col items-center justify-center text-outline hover:text-primary transition-colors group" href="#">
                    <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="material-symbols-outlined">folder_open</motion.span>
                    <span className="font-label-sm text-[10px] mt-1 opacity-60 group-hover:opacity-100 transition-opacity">Kirim Surat</span>
                </a>
            </motion.nav>

            {/* Modal Format Surat */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-surface-container rounded-3xl p-6 md:p-8 w-full max-w-md border border-white/10 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-headline-lg text-primary">Format Surat</h2>
                                <motion.button 
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-on-surface transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </motion.button>
                            </div>
                            <div className="flex flex-col gap-3">
                                <motion.a whileHover={{ x: 5 }} href="https://docs.google.com/document/d/1VxhkE-MPCN1ikLUuK7-gghmxVFFvaDU3/edit?usp=sharing&ouid=104771150630152243275&rtpof=true&sd=true" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-primary/20 text-on-surface hover:text-primary border border-white/5 hover:border-primary/30 transition-all group">
                                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">description</span>
                                    <span className="font-label-md">Laporan Pertanggung Jawaban</span>
                                </motion.a>
                                <motion.a whileHover={{ x: 5 }} href="https://docs.google.com/document/d/1HQ0fnl4Uzq7Nlzh-zYxgwJ3KNyl_0uBO/edit?usp=sharing&ouid=104771150630152243275&rtpof=true&sd=true" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-primary/20 text-on-surface hover:text-primary border border-white/5 hover:border-primary/30 transition-all group">
                                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">description</span>
                                    <span className="font-label-md">Proposal Kegiatan</span>
                                </motion.a>
                                <motion.a whileHover={{ x: 5 }} href="https://docs.google.com/document/d/1o0r08jKWnzcQ3aa60NsbQk0bDaafu23N/edit?usp=sharing&ouid=104771150630152243275&rtpof=true&sd=true" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-primary/20 text-on-surface hover:text-primary border border-white/5 hover:border-primary/30 transition-all group">
                                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">description</span>
                                    <span className="font-label-md">Surat Peminjaman Ruangan</span>
                                </motion.a>
                                <motion.a whileHover={{ x: 5 }} href="https://docs.google.com/document/d/159UJutwMsRuYvW8EoIvwhD0yrNNtCGty/edit?usp=sharing&ouid=104771150630152243275&rtpof=true&sd=true" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-primary/20 text-on-surface hover:text-primary border border-white/5 hover:border-primary/30 transition-all group">
                                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">description</span>
                                    <span className="font-label-md">Surat Undangan</span>
                                </motion.a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
                {isCalendarModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={() => setIsCalendarModalOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-surface-container rounded-3xl p-6 md:p-8 w-full max-w-md border border-white/10 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-headline-lg text-primary">Pilih Aplikasi Kalender</h2>
                                <motion.button 
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsCalendarModalOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-on-surface transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </motion.button>
                            </div>
                            <div className="flex flex-col gap-3">
                                <motion.a whileHover={{ x: 5 }} href="https://calendar.google.com/calendar/u/0/r?cid=ZXNrYWxhc2lrYXJ5YWhpbWFza29tQGdtYWlsLmNvbQ" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-primary/20 text-on-surface hover:text-primary border border-white/5 hover:border-primary/30 transition-all group">
                                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">language</span>
                                    <div className="flex flex-col">
                                        <span className="font-label-md">Buka di Web (Google Calendar)</span>
                                        <span className="text-xs text-on-surface-variant">Untuk browser Android & PC</span>
                                    </div>
                                </motion.a>
                                <motion.a whileHover={{ x: 5 }} href="webcal://calendar.google.com/calendar/ical/eskalasikaryahimaskom%40gmail.com/public/basic.ics" className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-primary/20 text-on-surface hover:text-primary border border-white/5 hover:border-primary/30 transition-all group">
                                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">app_shortcut</span>
                                    <div className="flex flex-col">
                                        <span className="font-label-md">Aplikasi Kalender Bawaan</span>
                                        <span className="text-xs text-on-surface-variant">Apple Calendar / Microsoft Outlook</span>
                                    </div>
                                </motion.a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default App
