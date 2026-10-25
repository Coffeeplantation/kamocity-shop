Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      devise_for :users,
                 controllers: {
                   sessions: 'api/v1/auth/sessions',
                   registrations: 'api/v1/auth/registrations'
                 },
                 path: 'auth',
                 path_names: {
                   sign_in: 'sign_in',
                   sign_out: 'sign_out',
                   registration: 'sign_up'
                 }

      # カード決済（PAY.JP）による購入は廃止した
      resources :furimas, only: [:index, :show, :create, :update, :destroy]

      get 'users/me', to: 'users#me'
      get 'master_data', to: 'users#master_data'
      resources :users, only: [:show]
    end
  end
end
