class Api::V1::FurimasController < ApplicationController
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  before_action :set_furima, only: [:show, :update, :destroy]

  def index
    furimas = Furima.includes(:user, :order, image_attachment: :blob)
                    .order(created_at: :desc)
    render json: furimas.map { |f| furima_json(f) }
  end

  def show
    render json: furima_detail_json(@furima)
  end

  def create
    furima = Furima.new(furima_params)
    if furima.save
      render json: furima_detail_json(furima), status: :created
    else
      render json: { errors: furima.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @furima.user_id != current_user.id
      render json: { error: 'Forbidden' }, status: :forbidden and return
    end
    if @furima.update(furima_params)
      render json: furima_detail_json(@furima)
    else
      render json: { errors: @furima.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @furima.user_id != current_user.id
      render json: { error: 'Forbidden' }, status: :forbidden and return
    end
    @furima.destroy
    render json: { message: 'Deleted successfully' }
  end

  private

  def set_furima
    @furima = Furima.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Not found' }, status: :not_found
  end

  def furima_params
    params.require(:furima).permit(
      :image, :price, :item, :item_text,
      :category_id, :condition_id, :fee_id,
      :prefecture_id, :scheduled_delivery_id
    ).merge(user_id: current_user.id)
  end

  def furima_json(furima)
    {
      id: furima.id,
      item: furima.item,
      price: furima.price,
      fee_name: furima.fee.name,
      sold_out: furima.order.present?,
      image_url: furima.image.attached? ? url_for(furima.image) : nil
    }
  end

  def furima_detail_json(furima)
    {
      id: furima.id,
      item: furima.item,
      item_text: furima.item_text,
      price: furima.price,
      category: { id: furima.category_id, name: furima.category.name },
      condition: { id: furima.condition_id, name: furima.condition.name },
      fee: { id: furima.fee_id, name: furima.fee.name },
      prefecture: { id: furima.prefecture_id, name: furima.prefecture.name },
      scheduled_delivery: { id: furima.scheduled_delivery_id, name: furima.scheduled_delivery.name },
      sold_out: furima.order.present?,
      user: { id: furima.user_id, nickname: furima.user.nickname },
      image_url: furima.image.attached? ? url_for(furima.image) : nil
    }
  end
end
