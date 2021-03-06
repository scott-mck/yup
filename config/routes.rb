Rails.application.routes.draw do
  root 'static_pages#root'

  resources :users, only: [:create, :new]
  resource :session, only: [:create, :destroy, :new]
  namespace 'api', defaults: { format: :json } do
    get 'users/sample' => 'users#sample'
    get 'reviews/sample' => 'reviews#sample'
    resources 'users', only: [:show, :update, :destroy]
    resources 'businesses', only: [:index, :show]
    resources 'reviews', only: [:index, :create, :show]
    resources 'followings', only: [:create, :show, :destroy]
  end
end
