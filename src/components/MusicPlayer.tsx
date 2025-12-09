import { useEffect, useRef, useState } from 'react'

export const MusicPlayer = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        const loadAudio = async () => {
            try {
                const modules = import.meta.glob('/src/assets/audio/bgm.mp3', { eager: true, query: '?url', import: 'default' })
                const bgmPath = Object.values(modules)[0] as string

                if (bgmPath) {
                    const audio = new Audio(bgmPath)
                    audio.loop = true
                    audio.volume = 0.5
                    audioRef.current = audio

                    // Try auto-play
                    audio.play()
                        .then(() => {
                            setIsPlaying(true)
                        })
                        .catch((e) => {
                            console.log("Autoplay prevented, waiting for interaction", e)
                            setIsPlaying(false)
                        })
                }
            } catch (e) {
                console.warn("BGM not found or failed to load", e)
            }
        }

        loadAudio()

        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
        }
    }, [])

    const togglePlay = () => {
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play().catch(console.error)
        }
        setIsPlaying(!isPlaying)
    }

    // Check if file exists using glob
    const modules = import.meta.glob('/src/assets/audio/bgm.mp3', { eager: true })
    const hasAudioFile = Object.keys(modules).length > 0

    if (!hasAudioFile) return null

    return (
        <button
            onClick={togglePlay}
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1000,
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(4px)'
            }}
            title={isPlaying ? "Pause Music" : "Play Music"}
        >
            {isPlaying ? (
                // Pause Icon
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
            ) : (
                // Play/Music Icon
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                </svg>
            )}
        </button>
    )
}
