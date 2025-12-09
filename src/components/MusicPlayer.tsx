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
            title={isPlaying ? "Mute Music" : "Play Music"}
        >
            {isPlaying ? (
                // Playing: Music Note
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
            ) : (
                // Paused: Music Note with Slash (No Parking style)
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73L19.73 21 21 19.73 4.27 3zM14 7h4V3h-6v5.18l2 2z" />
                </svg>
            )}
        </button>
    )
}
