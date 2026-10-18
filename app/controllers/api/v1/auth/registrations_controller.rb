class Api::V1::Auth::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        status: { code: 200, message: 'Signed up successfully.' },
        data: user_json(resource)
      }, status: :ok
    else
      render json: {
        status: { code: 422, message: resource.errors.full_messages.join(', ') }
      }, status: :unprocessable_entity
    end
  end

  def sign_up_params
    params.require(:user).permit(
      :email, :password, :password_confirmation,
      :nickname, :first_name, :family_name,
      :first_name_kana, :family_name_kana, :birth_date
    )
  end

  def user_json(user)
    {
      id: user.id,
      email: user.email,
      nickname: user.nickname
    }
  end
end
