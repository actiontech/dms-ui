import { useEffect } from 'react';
import { useWorkerLayoutForceAtlas2 } from '@react-sigma/layout-forceatlas2';

const Fa2: React.FC = () => {
  const { start, kill, stop } = useWorkerLayoutForceAtlas2({
    settings: {
      slowDown: 10,
      gravity: 1, // 增加重力，防止节点飞散
      strongGravityMode: false,
      scalingRatio: 2, // 增加节点间斥力
      linLogMode: true, // 使用对数模式，更好地处理大图
      outboundAttractionDistribution: true, // 基于度数分布吸引力
      adjustSizes: true // 考虑节点大小
    }
  });

  useEffect(() => {
    // start FA2
    start();

    const timer = setTimeout(() => {
      stop();
    }, 10000);

    // Kill FA2 on unmount
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      kill();
    };
  }, [start, kill, stop]);

  return null;
};
export default Fa2;
