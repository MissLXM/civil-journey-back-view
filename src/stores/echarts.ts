// 引入 echarts 核心模块。
import * as echarts from 'echarts/core';
//引入组件。
import { BarChart, LineChart, PieChart } from 'echarts/charts';


// 引入标题、提示框、网格、数据集和数据转换器组件。
import {
    GridComponent,
    TitleComponent,
    TooltipComponent,
    // 数据集组件
    DatasetComponent,
    // 内置数据转换器组件 (filter, sort)
    TransformComponent
} from 'echarts/components';


// 引入 Canvas 渲染器。
import { CanvasRenderer } from 'echarts/renderers';
//引入标签布局和通用过渡动画特性。
import { LabelLayout, UniversalTransition } from 'echarts/features';
 
import type {
    // 系列类型的定义后缀都为 SeriesOption
    BarSeriesOption,
    PieSeriesOption,
    LineSeriesOption,
} from 'echarts/charts';
 
import type {
    // 组件类型的定义后缀都为 ComponentOption
    GridComponentOption,
    TitleComponentOption,
    TooltipComponentOption,
    DatasetComponentOption
} from 'echarts/components';
import type {
    ComposeOption,
} from 'echarts/core';


// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type ECOption = ComposeOption<
    | BarSeriesOption
    | PieSeriesOption
    | LineSeriesOption
    | GridComponentOption
    | TitleComponentOption
    | TooltipComponentOption
    | DatasetComponentOption
>;
 
/** 
    注册必须的组件，包括标题、提示框、网格、数据集、数据转换器，
    以及柱状图、折线图、标签布局、通用过渡动画和 Canvas 渲染器。
*/
echarts.use([
    BarChart,
    PieChart,
    LineChart,
    LabelLayout,
    GridComponent,
    CanvasRenderer,
    TitleComponent,
    TooltipComponent,
    DatasetComponent,
    TransformComponent,
    UniversalTransition,
]);

// 导出
export default echarts;