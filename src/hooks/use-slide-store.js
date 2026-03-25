import { create } from 'zustand';

const createDefaultSlide = (index) => ({
  id: Date.now() + index,
  title: `Architectural Step ${index + 1}`,
  code: `// Slide ${index + 1}\nfunction processRequest(req) {\n  console.log("Optimizing step ${index + 1}...");\n  return { success: true, timestamp: Date.now() };\n}`,
  filename: `module_v${index + 1}.ts`,
  tags: 'Architecture Design Scaling',
});

export const useSlideStore = create((set) => ({
  slides: [createDefaultSlide(0)],
  currentSlideIndex: 0,
  author: 'Ihor Solomianyi',
  role: 'Software Engineer',
  padding: [36],
  showLineNumbers: true,
  currentTheme: 'minimalist',

  setAuthor: (author) => set({ author }),
  setRole: (role) => set({ role }),
  setPadding: (padding) => set({ padding }),
  setShowLineNumbers: (showLineNumbers) => set({ showLineNumbers }),
  setCurrentTheme: (currentTheme) => set({ currentTheme }),
  setCurrentSlideIndex: (currentSlideIndex) => set({ currentSlideIndex }),

  addSlide: () => set((state) => {
    const newSlide = createDefaultSlide(state.slides.length);
    return {
      slides: [...state.slides, newSlide],
      currentSlideIndex: state.slides.length
    };
  }),

  removeSlide: (index) => set((state) => {
    if (state.slides.length <= 1) return state;
    const newSlides = state.slides.filter((_, i) => i !== index);
    return {
      slides: newSlides,
      currentSlideIndex: Math.max(0, state.currentSlideIndex - 1)
    };
  }),

  updateCurrentSlide: (field, value) => set((state) => {
    const newSlides = [...state.slides];
    newSlides[state.currentSlideIndex] = { 
      ...newSlides[state.currentSlideIndex], 
      [field]: value 
    };
    return { slides: newSlides };
  }),
}));
