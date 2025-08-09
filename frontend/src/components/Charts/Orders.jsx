import OrdersLineChart from './TotalOrders/OrdersLineChart'
import TotalOrders from './TotalOrders/TotalOrders'

function Orders() {
  return (
    <div className="flex flex-col w-full items-center justify-center gap-8 py-8 px-4">
  <div className="w-full xl:w-3/5">
    <TotalOrders />
  </div>
  <div className="w-full xl:w-3/5">
    <OrdersLineChart />
  </div>
</div>

  )
}

export default Orders
