class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user!, only: [:show, :me]

  def show
    user = User.find(params[:id])
    furimas = user.furimas.includes(:order, image_attachment: :blob).order(created_at: :desc)
    render json: {
      id: user.id,
      nickname: user.nickname,
      furimas: furimas.map { |f|
        {
          id: f.id,
          item: f.item,
          price: f.price,
          fee_name: f.fee.name,
          sold_out: f.order.present?,
          image_url: f.image.attached? ? url_for(f.image) : nil
        }
      }
    }
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'User not found' }, status: :not_found
  end

  def me
    render json: {
      id: current_user.id,
      email: current_user.email,
      nickname: current_user.nickname
    }
  end

  def master_data
    render json: {
      categories: Category.all.map { |c| { id: c.id, name: c.name } },
      conditions: Condition.all.map { |c| { id: c.id, name: c.name } },
      fees: Fee.all.map { |f| { id: f.id, name: f.name } },
      prefectures: Prefecture.all.map { |p| { id: p.id, name: p.name } },
      scheduled_deliveries: ScheduledDelivery.all.map { |s| { id: s.id, name: s.name } }
    }
  end
end
