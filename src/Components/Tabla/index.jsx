import { Table, ConfigProvider, Empty } from "antd";
import esES from 'antd/lib/locale/es_ES';

export default function Tabla({
  columns,
  dataSource,
  loading,
  pagination = { pageSize: 10 },
  rowKey = "id",
  footer,
  size = "small",
  ...props
}) {
  return (
    <ConfigProvider locale={esES}>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
        scroll={{ x: "max-content" }}
        rowKey={rowKey}
        footer={footer}
        size={size}
        locale={{
          emptyText: <Empty description="No hay datos que mostrar" />
        }}
        {...props}
      />
    </ConfigProvider>
  );
}