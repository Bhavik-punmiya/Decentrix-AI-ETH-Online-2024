
import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa'

const Sidebar = ({ isOpen, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button onClick={onClose}>
        <FaTimes />
      </button>
      <h2>Sidebar</h2>
      <p>Content goes here...</p>
      <button onClick={toggleExpand}>Toggle Expand</button>
      {isExpanded && <p>This content will be visible when expanded.</p>}
    </aside>
  )
}

export default Sidebar
