# UI Design Principles and Components Guide

This document outlines the design principles and component specifications for the FDA Tracker Frontend application. It serves as a reference for maintaining consistency across the application's user interface.

## Table of Contents
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Components](#components)
  - [Cards](#cards)
  - [Forms](#forms)
  - [Input Fields](#input-fields)
  - [Tables](#tables)
  - [Buttons](#buttons)
  - [Navigation](#navigation)
  - [Charts](#charts)

## Color Palette

### Primary Colors
- Primary Blue: `#1976d2`
- Secondary Blue: `#2196f3`
- Accent Blue: `#bbdefb`

### Neutral Colors
- Dark Gray: `#333333`
- Medium Gray: `#666666`
- Light Gray: `#f5f5f5`
- White: `#ffffff`

### Status Colors
- Success: `#4caf50`
- Warning: `#ff9800`
- Error: `#f44336`
- Info: `#2196f3`

## Typography

### Font Family
- Primary Font: Roboto
- Secondary Font: Arial (fallback)
- Monospace: Consolas (for code snippets)

### Font Sizes
- Heading 1: 2.5rem (40px)
- Heading 2: 2rem (32px)
- Heading 3: 1.75rem (28px)
- Body Text: 1rem (16px)
- Small Text: 0.875rem (14px)
- Caption: 0.75rem (12px)

## Components

### Cards

Cards should be used to group related information and actions. We support both light and dark themed cards for different contexts.

#### Light Theme Card
```jsx
<Card>
  <CardHeader title="Card Title" />
  <CardContent>Content goes here</CardContent>
  <CardActions>Actions here</CardActions>
</Card>
```

Light Theme Styling:
- Border radius: 8px
- Box shadow: `0 2px 4px rgba(0, 0, 0, 0.1)`
- Padding: 16px
- Background: white
- Margin between cards: 16px

#### Dark Theme Card (Stats/Dashboard)
```jsx
<div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-400">Total Inspections Done</p>
      <p className="text-2xl font-semibold text-white mt-2">168</p>
    </div>
    <svg 
      className="h-8 w-8 text-blue-400"
      // ... icon properties ...
    >
      {/* Icon content */}
    </svg>
  </div>
</div>
```

Dark Theme Styling:
- Background: `bg-gray-800` (dark gray)
- Border: `border border-gray-700`
- Border radius: `rounded-lg`
- Padding: `p-6`
- Text colors:
  - Label: `text-gray-400` (muted text)
  - Value: `text-white` (prominent text)
- Icon:
  - Size: `h-8 w-8`
  - Color: `text-blue-400` (accent color)
- Typography:
  - Label: `text-sm`
  - Value: `text-2xl font-semibold`
- Layout:
  - Flex container with `justify-between` for spacing
  - Vertical spacing: `mt-2` between elements

Common Card Usage:
- Statistics and metrics
- Summary information
- Action items
- Content grouping
- Dashboard widgets
- Feature highlights

Best Practices:
- Use consistent spacing within cards
- Maintain clear visual hierarchy
- Include appropriate icons to enhance understanding
- Ensure sufficient contrast for text readability
- Keep content concise and focused
- Use appropriate card style based on context (light/dark theme)

### Forms

Forms should be organized and easy to understand:

- Group related fields together
- Use clear labels above input fields
- Provide helper text when necessary
- Show validation errors inline
- Include a clear submission button

Example structure:
```jsx
<form>
  <FormGroup>
    <FormLabel>Field Label</FormLabel>
    <FormControl />
    <FormHelperText>Helper text</FormHelperText>
  </FormGroup>
</form>
```

### Input Fields

Input fields should be consistent across the application:

- Height: 40px
- Padding: 8px 12px
- Border: 1px solid `#ddd`
- Border radius: 4px
- Focus state: Blue outline
- Error state: Red border and helper text

Types of inputs:
- Text inputs
- Select dropdowns
- Checkboxes
- Radio buttons
- Date pickers
- Time pickers

### Tables

Tables should be used for displaying structured data. We support both light and dark themed tables for different contexts.

#### Search and Filter Components

##### Search Bar
```jsx
<div className="relative flex-1">
  <svg 
    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
    // Search icon properties
  >
    {/* Search icon content */}
  </svg>
  <input 
    type="text" 
    placeholder="Search..." 
    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 
              placeholder-gray-400"
  />
</div>
```

Search Bar Styling:
- Container: `relative flex-1`
- Input:
  - Background: `bg-gray-700`
  - Border: `border border-gray-600`
  - Border Radius: `rounded-lg`
  - Text Color: `text-gray-100`
  - Placeholder: `placeholder-gray-400`
  - Padding: `pl-10 pr-4 py-2` (left padding accounts for icon)
  - Focus: `focus:ring-2 focus:ring-blue-500 focus:border-transparent`
- Search Icon:
  - Position: `absolute left-3 top-1/2 transform -translate-y-1/2`
  - Color: `text-gray-400`
  - Size: `h-5 w-5`

##### Filter Dropdown
```jsx
<select className="bg-gray-700 border border-gray-600 rounded-lg text-white px-4 py-2">
  <option value="all">All Items</option>
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
</select>
```

Filter Dropdown Styling:
- Background: `bg-gray-700`
- Border: `border border-gray-600`
- Border Radius: `rounded-lg`
- Text Color: `text-white`
- Padding: `px-4 py-2`
- Hover: `hover:bg-gray-600`
- Focus: `focus:ring-2 focus:ring-blue-500 focus:border-transparent`

Best Practices for Search and Filters:
- Position search and filters above the table
- Align search bar to the left and filters to the right
- Use consistent spacing between components
- Provide clear visual feedback for active filters
- Include placeholder text in search bar
- Support keyboard navigation
- Implement real-time search when possible
- Allow multiple filter selections when appropriate
- Show clear/reset options for active filters
- Maintain filter state across page navigation

Layout Example:
```jsx
<div className="flex flex-col sm:flex-row gap-4 mb-4">
  {/* Search Bar */}
  <div className="relative flex-1">
    <SearchIcon />
    <input type="text" placeholder="Search..." />
  </div>
  
  {/* Filters */}
  <div className="flex gap-2">
    <select>
      <option>Filter 1</option>
    </select>
    <select>
      <option>Filter 2</option>
    </select>
  </div>
</div>
```

Responsive Behavior:
- Stack search and filters vertically on mobile
- Full width search bar on mobile
- Collapsible filters on mobile
- Maintain minimum touch target size (44px)
- Show/hide filters button on mobile

Loading States:
- Disable search and filters during loading
- Show loading indicator in search bar
- Maintain filter selections during loading
- Prevent multiple simultaneous searches

Empty/No Results States:
- Show clear message when no results match
- Provide suggestions for improving search
- Show active filters that may be restricting results
- Option to clear all filters

#### Dark Theme Table (Primary Style)
```jsx
<div className="bg-gray-800 rounded-lg border border-gray-700">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-700">
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white">
            Column Header
            <svg className="inline-block ml-1 h-4 w-4">
              {/* Sort icon */}
            </svg>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700">
        <tr className="hover:bg-gray-700/50 transition-colors cursor-pointer">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-white">Content</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  
  {/* Pagination */}
  <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
    <div className="text-sm text-gray-400">
      Showing <span className="font-medium text-white">1</span> to <span className="font-medium text-white">10</span> of <span className="font-medium text-white">29</span> entries
    </div>
    <div className="flex items-center gap-1">
      <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700">
        {/* Previous page icon */}
      </button>
      <div className="flex gap-1">
        <button className="px-3 py-1 rounded-lg bg-blue-500 text-white">1</button>
        <button className="px-3 py-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700">2</button>
      </div>
      <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700">
        {/* Next page icon */}
      </button>
    </div>
  </div>
</div>
```

Dark Theme Styling:
- Container:
  - Background: `bg-gray-800`
  - Border: `border border-gray-700`
  - Border Radius: `rounded-lg`

- Headers:
  - Text Color: `text-gray-400`
  - Hover: `hover:text-white`
  - Border Bottom: `border-b border-gray-700`
  - Padding: `px-6 py-3`
  - Text Transform: `uppercase`
  - Font Size: `text-xs`
  - Tracking: `tracking-wider`
  - Cursor: `cursor-pointer` (for sortable columns)

- Table Body:
  - Row Dividers: `divide-y divide-gray-700`
  - Row Hover: `hover:bg-gray-700/50`
  - Transition: `transition-colors`
  - Cursor: `cursor-pointer` (for clickable rows)

- Cell Content:
  - Primary Text: `text-white font-medium`
  - Secondary Text: `text-gray-400`
  - Font Size: `text-sm`
  - Whitespace: `whitespace-nowrap` (prevent wrapping)
  - Padding: `px-6 py-4`

- Status Badges:
  ```jsx
  <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-blue-400/10 text-blue-400">
    Status
  </span>
  ```

- Links:
  - Color: `text-blue-400`
  - Hover: `hover:underline`

- Pagination:
  - Container: `border-t border-gray-700`
  - Text: `text-gray-400`
  - Highlighted Text: `text-white font-medium`
  - Buttons:
    - Normal: `text-gray-400 hover:text-white hover:bg-gray-700`
    - Active: `bg-blue-500 text-white`
    - Disabled: `text-gray-500 cursor-not-allowed`
  - Button Size: `px-3 py-1`
  - Border Radius: `rounded-lg`

#### Light Theme Table (Alternative Style)
```jsx
<div className="bg-white rounded-lg shadow">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Column Header
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          Content
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

Light Theme Styling:
- Container:
  - Background: `bg-white`
  - Shadow: `shadow`
  - Border Radius: `rounded-lg`

- Headers:
  - Background: `bg-gray-50`
  - Text Color: `text-gray-500`
  - Border Bottom: `divide-y divide-gray-200`

- Table Body:
  - Row Dividers: `divide-y divide-gray-200`
  - Row Hover: `hover:bg-gray-50`
  - Primary Text: `text-gray-900`
  - Secondary Text: `text-gray-500`

Best Practices:
- Use appropriate theme based on context and surrounding UI
- Maintain consistent spacing and alignment
- Include hover states for interactive elements
- Provide clear visual hierarchy
- Use appropriate text colors for contrast
- Include loading states
- Handle empty states gracefully
- Support responsive layouts
- Implement proper accessibility attributes

Features:
- Sortable columns with visual indicators
- Pagination with page size options
- Row selection (when needed)
- Responsive design
- Loading states
- Empty states
- Error handling
- Search/filter capability

### Buttons

Button hierarchy:

1. Primary Button
```css
{
  background: #1976d2;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
}
```

2. Secondary Button
```css
{
  background: white;
  color: #1976d2;
  border: 1px solid #1976d2;
  padding: 8px 16px;
  border-radius: 4px;
}
```

3. Text Button
```css
{
  background: transparent;
  color: #1976d2;
  padding: 8px 16px;
}
```

### Navigation

Navigation elements should be:
- Clear and consistent
- Highlight current section
- Provide clear feedback on hover/active states
- Use icons where appropriate
- Be responsive and mobile-friendly

## Spacing

Use consistent spacing throughout the application:

- Extra small: 4px
- Small: 8px
- Medium: 16px
- Large: 24px
- Extra large: 32px
- XXL: 48px

## Responsive Design

Breakpoints:
- Mobile: < 600px
- Tablet: 600px - 960px
- Desktop: > 960px

Guidelines:
- Use fluid layouts
- Stack elements vertically on mobile
- Hide non-essential elements on smaller screens
- Ensure touch targets are at least 44px x 44px
- Test on various screen sizes

## Accessibility

- Use semantic HTML elements
- Maintain color contrast ratios (WCAG 2.1)
- Provide alt text for images
- Support keyboard navigation
- Use ARIA labels where necessary
- Test with screen readers

## Icons

- Use Material Icons as the primary icon set
- Maintain consistent icon sizes
- Use icons to enhance, not replace, text labels
- Keep icons simple and recognizable

## Loading States

- Use skeleton screens for content loading
- Show loading spinners for actions
- Disable buttons during form submission
- Provide feedback for long-running operations

## Error Handling

- Show clear error messages
- Provide recovery actions
- Use appropriate error states for form fields
- Handle network errors gracefully
- Show empty states when no data is available

## Animation

- Use subtle transitions (0.2-0.3s duration)
- Animate state changes
- Keep animations smooth and purposeful
- Respect reduced motion preferences

### Charts

Charts should be used to visualize data in an intuitive and accessible way. We support both light and dark themed charts for different contexts.

#### Area Chart (Dark Theme)
```jsx
<div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 shadow-lg">
  <h3 className="text-base font-medium text-white mb-6">Chart Title</h3>
  <canvas role="img" height="336" width="672"></canvas>
</div>
```

Area Chart Container Styling:
- Background: `bg-gray-800/50` (semi-transparent dark gray)
- Backdrop Filter: `backdrop-blur-sm`
- Border: `border border-gray-700/50` (semi-transparent border)
- Border Radius: `rounded-xl`
- Padding: `p-6`
- Shadow: `shadow-lg`
- Title:
  - Font Size: `text-base`
  - Font Weight: `font-medium`
  - Color: `text-white`
  - Margin Bottom: `mb-6`

Chart Configuration Best Practices:
- Colors:
  - Primary Area Fill: `rgba(59, 130, 246, 0.2)` (semi-transparent blue)
  - Line Color: `rgb(59, 130, 246)` (solid blue)
  - Grid Lines: `rgba(255, 255, 255, 0.1)` (subtle white)
  - Text: `rgb(156, 163, 175)` (gray-400)
- Typography:
  - Axis Labels: 12px
  - Tick Labels: 11px
  - Legend: 12px
- Interactions:
  - Hover Effects: Show tooltip with data point details
  - Tooltip Background: `rgba(17, 24, 39, 0.8)` (semi-transparent dark)
  - Tooltip Border: `border-gray-700`
- Responsiveness:
  - Maintain aspect ratio
  - Resize smoothly on container changes
  - Hide minor grid lines on mobile

Example Chart Options:
```javascript
{
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      borderColor: 'rgb(55, 65, 81)',
      borderWidth: 1,
      titleColor: 'rgb(255, 255, 255)',
      bodyColor: 'rgb(156, 163, 175)',
      padding: 12,
      cornerRadius: 8
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        drawBorder: false
      },
      ticks: {
        color: 'rgb(156, 163, 175)'
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        drawBorder: false
      },
      ticks: {
        color: 'rgb(156, 163, 175)'
      }
    }
  }
}
```

Best Practices:
- Use consistent colors across all charts
- Provide clear labels and titles
- Include hover states for data points
- Show loading states during data fetch
- Handle empty states gracefully
- Support responsive resizing
- Ensure accessibility with ARIA labels
- Include proper data formatting
- Optimize performance for large datasets

Layout Considerations:
- Maintain sufficient spacing around charts
- Group related charts together
- Consider mobile viewports
- Allow for flexible widths
- Maintain readable text sizes

Accessibility:
- Include descriptive alt text
- Support keyboard navigation
- Provide data table alternatives
- Use sufficient color contrast
- Include screen reader descriptions

---

This guide should be treated as a living document and updated as the design system evolves. All new components and features should adhere to these guidelines to maintain consistency throughout the application. 