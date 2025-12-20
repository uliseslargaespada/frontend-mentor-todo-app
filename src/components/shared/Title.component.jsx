/* Title.component.jsx
  * Style Component: Title
  * A reusable title component for consistent styling of headings.
  */
const Title = ({ children, hLevel = 1, className = "" }) => {
  const Tag = `h${hLevel}`;
  return (
    <Tag className={`text-3xl font-bold mb-4 text-primary ${className}`}>
      {children}
    </Tag>
  );
};

export default Title;
