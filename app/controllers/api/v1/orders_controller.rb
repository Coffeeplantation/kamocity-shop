class Api::V1::OrdersController < Api::V1::BaseController
  before_action :set_furima
  before_action :check_purchasable

  def create
    order_address = OrderAddress.new(order_params)
    if order_address.valid?
      pay_item(order_address)
      order_address.save
      render json: { message: 'Purchase completed successfully' }, status: :created
    else
      render json: { errors: order_address.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_furima
    @furima = Furima.find(params[:furima_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Item not found' }, status: :not_found
  end

  def check_purchasable
    if current_user.id == @furima.user_id
      render json: { error: 'You cannot purchase your own item' }, status: :forbidden
    elsif @furima.order.present?
      render json: { error: 'This item is already sold' }, status: :unprocessable_entity
    end
  end

  def order_params
    params.require(:order).permit(
      :post_code, :prefecture_id, :city,
      :address, :building_name, :phone_number
    ).merge(user_id: current_user.id, furima_id: @furima.id, token: params[:token])
  end

  def pay_item(order_address)
    Payjp.api_key = ENV['PAYJP_SECRET_KEY']
    Payjp::Charge.create(
      amount: @furima.price,
      card: order_address.token,
      currency: 'jpy'
    )
  end
end
