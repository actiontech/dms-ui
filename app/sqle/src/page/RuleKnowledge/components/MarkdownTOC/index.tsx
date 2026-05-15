import React, { useEffect, useState } from 'react';
import { Anchor } from 'antd';
import { AnchorProps } from 'antd/lib/anchor';

interface MarkdownTOCProps extends Omit<AnchorProps, 'items'> {
  containerRef?: React.RefObject<HTMLElement>;
  markdownLoaded: boolean;
}

interface AnchorItem {
  key: string;
  href: string;
  title: string;
  children?: AnchorItem[];
}

const MarkdownTOC: React.FC<MarkdownTOCProps> = ({
  markdownLoaded,
  containerRef,
  ...anchorProps
}) => {
  const [anchorItems, setAnchorItems] = useState<AnchorItem[]>([]);

  useEffect(() => {
    if (!markdownLoaded || !containerRef?.current?.className) {
      setAnchorItems([]);
      return;
    }
    // 查找 Markdown 容器
    const contentContainer = document.querySelector(
      `.${containerRef?.current?.className}`
    );
    if (!contentContainer) return;

    // 获取所有标题元素
    const headers = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headers.length === 0) return;

    // 为没有 id 的标题添加 id
    headers.forEach((header, index) => {
      if (!header.id) {
        const id = `header-${index}`;
        header.id = id;
      }
    });

    // 构建锚点项
    const items: AnchorItem[] = [];
    const levelMap: Record<number, AnchorItem[]> = {};

    headers.forEach((header) => {
      const level = parseInt(header.tagName.substring(1), 10);
      const title = header.textContent || '';
      const id = header.id;

      const item: AnchorItem = {
        key: id,
        href: `#${id}`,
        title
      };

      if (level === 1) {
        items.push(item);
        levelMap[1] = items;
      } else {
        const parentLevel = level - 1;
        const parentItems = levelMap[parentLevel];

        if (parentItems && parentItems.length > 0) {
          const parent = parentItems[parentItems.length - 1];
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(item);
          levelMap[level] = parent.children;
        } else {
          items.push(item);
          levelMap[level] = items;
        }
      }
    });

    setAnchorItems(items);
  }, [markdownLoaded, containerRef]);

  if (anchorItems.length === 0) {
    return null;
  }

  return (
    <Anchor
      items={anchorItems}
      replace
      getContainer={() => containerRef?.current || window}
      {...anchorProps}
    />
  );
};

export default MarkdownTOC;
