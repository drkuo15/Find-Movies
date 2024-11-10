import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import * as stylex from '@stylexjs/stylex';
import type { WatchListMovie } from '../../types/movie';
import { spacing, colors, radius, fontSize } from '../../styles/tokens.stylex';
import MovieCard from '../movieCard';

const styles = stylex.create({
  title: {
    fontSize: fontSize.xl,
    marginBottom: spacing.md,
  },
  lotterySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xl,
  },
  lotteryButton: {
    backgroundColor: colors.primary,
    color: colors.white,
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: radius.md,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: 'fit-content',
    ':hover': {
      transform: 'translateY(-1px)',
    },
    ':disabled': {
      backgroundColor: colors.gray700,
      cursor: 'not-allowed',
      transform: 'none',
    },
  },
  winnerWrapper: {
    boxShadow: `0 0 10px 0 ${colors.white}`,
    borderRadius: radius.lg,
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  },
});

export default function MovieLottery({ movies }: { movies: WatchListMovie[] }) {
  const [selectedMovie, setSelectedMovie] = useState<WatchListMovie | null>(
    null,
  );
  const [isSpinning, setIsSpinning] = useState(false);

  const pickRandomMovie = () => {
    if (!movies?.length) return;
    setIsSpinning(true);
    const preSelectedMovieId = localStorage.getItem('preSelectedMovie') ?? '';
    const moviesPool = preSelectedMovieId
      ? movies.filter((movie) => movie.id !== Number(preSelectedMovieId))
      : movies;

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * moviesPool.length);
      setSelectedMovie(moviesPool[randomIndex]);
      localStorage.setItem(
        'preSelectedMovie',
        moviesPool[randomIndex].id.toString(),
      );
      setIsSpinning(false);
      toast.success('Movie selected! 🎉');
    }, 1000);
  };

  return (
    <div {...stylex.props(styles.lotterySection)}>
      {movies?.length > 0 && (
        <button
          onClick={pickRandomMovie}
          disabled={isSpinning}
          {...stylex.props(styles.lotteryButton)}
        >
          {isSpinning ? '🎲 Spinning...' : '🎲 Pick a Random Movie'}
        </button>
      )}

      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3 {...stylex.props(styles.title)}>🎉 Your Movie for Tonight</h3>
            <div {...stylex.props(styles.winnerWrapper)}>
              <MovieCard movie={selectedMovie} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
